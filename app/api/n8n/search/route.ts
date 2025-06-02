import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { executeQuery } from "@/lib/db"
import { n8nTeloSchema } from "@/lib/validators/telo-schema"
import { generateSlug } from "@/utils/generate-slug"

const searchSchema = z.object({
  ciudad: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ciudad } = searchSchema.parse(body)

    console.log(`🔍 Iniciando búsqueda y persistencia para: ${ciudad}`)

    const n8nWebhookUrl = "https://huiciraul.app.n8n.cloud/webhook/buscar-tipos"
    const n8nWebhookToken = process.env.N8N_WEBHOOK_TOKEN

    console.log("📤 Realizando solicitud POST a n8n webhook (para activar y obtener datos):", { ciudad })

    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(n8nWebhookToken ? { Authorization: `Bearer ${n8nWebhookToken}` } : {}),
      },
      body: JSON.stringify({ ciudad }),
    })

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text()
      console.error(`Error response from n8n webhook: ${n8nResponse.status} - ${errorText}`)
      throw new Error(`Error en n8n webhook: ${n8nResponse.status} ${n8nResponse.statusText} - ${errorText}`)
    }

    const rawTelosData = await n8nResponse.json()
    console.log(`📥 Recibidos ${rawTelosData.length} telos de n8n webhook. Iniciando persistencia...`)
    console.log("Raw telos data from n8n:", JSON.stringify(rawTelosData, null, 2))

    const persistedTelos = []
    const results = {
      insertados: 0,
      actualizados: 0,
      descartados: 0,
      errores: 0,
    }

    for (const [index, teloData] of rawTelosData.entries()) {
      try {
        // Limpiar y normalizar datos antes de validar
        const cleanedData = {
          ...teloData,
          // Asegurar que ciudad no tenga prefijos y tenga un valor por defecto
          ciudad: teloData.ciudad?.replace(/^W\d+\s+/, "") || ciudad,
          // Asegurar que precio sea un número, asignando un valor por defecto si es null/undefined
          precio: teloData.precio != null ? Number(teloData.precio) : Math.floor(Math.random() * 3000) + 2000,
          // Asegurar que servicios sea un array, asignando valores por defecto si está vacío
          servicios:
            Array.isArray(teloData.servicios) && teloData.servicios.length > 0
              ? teloData.servicios
              : ["WiFi", "Estacionamiento"],
          // Convertir cadena vacía a null para telefono
          telefono: teloData.telefono === "" ? null : teloData.telefono,
          // Asegurar que rating sea un número, asignando un valor por defecto si es null/undefined
          rating: teloData.rating != null ? Number(teloData.rating) : Number((Math.random() * 2 + 3).toFixed(1)),
          // Convertir cadena vacía a null para imagen_url
          imagen_url: teloData.imagen_url === "" ? null : teloData.imagen_url,
          // El slug se generará por nuestra función, así que lo ignoramos del input
          slug: undefined,
        }

        const validatedTelo = n8nTeloSchema.parse(cleanedData)
        const slug = generateSlug(validatedTelo.nombre, true) // Siempre añadir timestamp para unicidad

        const existingTelo = await executeQuery<any[]>(
          `SELECT id, nombre, direccion, precio, updated_at, slug FROM telos 
           WHERE LOWER(nombre) = LOWER($1) AND LOWER(direccion) = LOWER($2) 
           LIMIT 1`,
          [validatedTelo.nombre, validatedTelo.direccion],
        )

        let currentTelo
        if (existingTelo.length > 0) {
          const existing = existingTelo[0]
          const hasChanges =
            existing.precio !== (validatedTelo.precio || 0) ||
            existing.nombre !== validatedTelo.nombre ||
            existing.direccion !== validatedTelo.direccion

          if (hasChanges) {
            const [updatedTelo] = await executeQuery(
              `
              UPDATE telos SET
                precio = $1,
                telefono = $2,
                servicios = $3,
                descripcion = $4,
                rating = $5,
                imagen_url = $6,
                lat = $7,
                lng = $8,
                updated_at = CURRENT_TIMESTAMP,
                fecha_scraping = $9
              WHERE id = $10
              RETURNING *
            `,
              [
                validatedTelo.precio || existing.precio,
                validatedTelo.telefono || null,
                validatedTelo.servicios,
                validatedTelo.descripcion || null,
                validatedTelo.rating || existing.rating,
                validatedTelo.imagen_url || null,
                validatedTelo.lat || null,
                validatedTelo.lng || null,
                validatedTelo.fecha_scraping
                  ? new Date(validatedTelo.fecha_scraping).toISOString()
                  : new Date().toISOString(),
                existing.id,
              ],
            )
            currentTelo = updatedTelo
            results.actualizados++
            console.log(`✏️ Telo actualizado: ${validatedTelo.nombre}`)
          } else {
            currentTelo = existing
            results.descartados++
          }
        } else {
          const insertQuery = `
            INSERT INTO telos (
              nombre, slug, direccion, ciudad, precio, telefono, 
              servicios, descripcion, rating, imagen_url, lat, lng, 
              activo, verificado, fuente, fecha_scraping
            ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, true, false, $13, $14)
            RETURNING *
          `

          const params = [
            validatedTelo.nombre,
            slug,
            validatedTelo.direccion,
            validatedTelo.ciudad,
            validatedTelo.precio || 0,
            validatedTelo.telefono || null,
            validatedTelo.servicios,
            validatedTelo.descripcion || null,
            validatedTelo.rating || 0,
            validatedTelo.imagen_url || null,
            validatedTelo.lat || null,
            validatedTelo.lng || null,
            validatedTelo.fuente || "n8n-search",
            validatedTelo.fecha_scraping
              ? new Date(validatedTelo.fecha_scraping).toISOString()
              : new Date().toISOString(),
          ]

          const [newTelo] = await executeQuery<any[]>(insertQuery, params)
          currentTelo = newTelo
          results.insertados++
          console.log(`✅ Nuevo telo insertado: ${validatedTelo.nombre} (ID: ${newTelo.id})`)
        }
        if (currentTelo) {
          persistedTelos.push(currentTelo)
        }
      } catch (validationError) {
        results.errores++
        console.error(`❌ Error procesando telo ${index + 1}:`, validationError)
      }
    }

    console.log(
      `📊 Búsqueda y persistencia completada: ${results.insertados} insertados, ${results.actualizados} actualizados, ${results.descartados} descartados, ${results.errores} errores`,
    )

    return NextResponse.json({
      success: true,
      telos: persistedTelos,
      total: persistedTelos.length,
      fuente: "n8n-persisted",
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("❌ Error en /api/n8n/search:", error)
    return NextResponse.json(
      {
        error: "Error interno del servidor al buscar y persistir telos",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
