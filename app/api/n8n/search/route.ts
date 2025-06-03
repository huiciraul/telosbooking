import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { executeQuery } from "@/lib/db"

const searchSchema = z.object({
  ciudad: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ciudad } = searchSchema.parse(body)

    console.log(`🔍 Iniciando búsqueda para: ${ciudad}`)

    // URL del webhook de n8n
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL
    const n8nWebhookToken = process.env.N8N_WEBHOOK_TOKEN

    if (!n8nWebhookUrl) {
      throw new Error("N8N_WEBHOOK_URL no configurada")
    }

    console.log("📤 Realizando solicitud a n8n webhook:", { ciudad })

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
      throw new Error(`Error en n8n webhook: ${n8nResponse.status}`)
    }

    const rawTelosData = await n8nResponse.json()
    console.log(`📥 Recibidos ${rawTelosData.length} telos de n8n`)

    const results = {
      insertados: 0,
      actualizados: 0,
      descartados: 0,
      errores: 0,
    }

    for (const [index, teloData] of rawTelosData.entries()) {
      try {
        // Validar datos mínimos
        if (!teloData.nombre || !teloData.direccion) {
          console.log("⚠️ Telo sin datos mínimos:", teloData.nombre)
          results.descartados++
          continue
        }

        // Procesar servicios de manera segura
        let servicios = ["WiFi"] // Default
        if (teloData.servicios && Array.isArray(teloData.servicios) && teloData.servicios.length > 0) {
          servicios = teloData.servicios.filter((s) => s && typeof s === "string" && s.trim().length > 0)
        }
        if (servicios.length === 0) {
          servicios = ["WiFi"]
        }

        // Limpiar y validar datos
        const cleanData = {
          nombre: String(teloData.nombre).trim(),
          slug: generateSlug(teloData.nombre),
          direccion: String(teloData.direccion).trim(),
          ciudad: String(teloData.ciudad || ciudad).trim(),
          telefono: (teloData.telefono && String(teloData.telefono).trim()) || null,
          precio: null, // SIEMPRE NULL
          servicios: servicios,
          descripcion:
            teloData.descripcion && String(teloData.descripcion).trim() !== "lodging, point_of_interest, establishment"
              ? String(teloData.descripcion).trim()
              : null,
          rating:
            teloData.rating && typeof teloData.rating === "number" && teloData.rating > 0
              ? Math.min(Math.max(teloData.rating, 0), 5)
              : null,
          imagen_url:
            teloData.imagen_url && String(teloData.imagen_url).trim() !== ""
              ? String(teloData.imagen_url).trim()
              : null,
          lat: teloData.lat && typeof teloData.lat === "number" ? Number(teloData.lat) : null,
          lng: teloData.lng && typeof teloData.lng === "number" ? Number(teloData.lng) : null,
          fuente: "n8n-search",
          activo: true,
        }

        console.log(`💾 Procesando telo: ${cleanData.nombre}`)

        // Verificar si existe
        const existingQuery = `
          SELECT id FROM telos 
          WHERE LOWER(TRIM(nombre)) = LOWER(TRIM('${cleanData.nombre.replace(/'/g, "''")}'))
            AND LOWER(TRIM(direccion)) = LOWER(TRIM('${cleanData.direccion.replace(/'/g, "''")}'))
          LIMIT 1
        `

        const existing = await executeQuery(existingQuery)

        if (existing.length > 0) {
          // Actualizar sin tocar el precio
          const updateQuery = `
            UPDATE telos SET
              updated_at = NOW(),
              fuente = '${cleanData.fuente}',
              servicios = '${JSON.stringify(cleanData.servicios)}',
              imagen_url = COALESCE(${cleanData.imagen_url ? `'${cleanData.imagen_url.replace(/'/g, "''")}'` : "NULL"}, imagen_url),
              lat = COALESCE(${cleanData.lat}, lat),
              lng = COALESCE(${cleanData.lng}, lng),
              rating = COALESCE(${cleanData.rating}, rating)
            WHERE id = '${existing[0].id}'
          `

          await executeQuery(updateQuery)
          results.actualizados++
        } else {
          // Insertar nuevo telo
          const insertQuery = `
            INSERT INTO telos (
              nombre, slug, direccion, ciudad, telefono, precio, servicios, 
              descripcion, rating, imagen_url, lat, lng, fuente, activo, 
              created_at, updated_at
            ) VALUES (
              '${cleanData.nombre.replace(/'/g, "''")}', 
              '${cleanData.slug}', 
              '${cleanData.direccion.replace(/'/g, "''")}', 
              '${cleanData.ciudad.replace(/'/g, "''")}', 
              ${cleanData.telefono ? `'${cleanData.telefono.replace(/'/g, "''")}'` : "NULL"}, 
              NULL, 
              '${JSON.stringify(cleanData.servicios)}', 
              ${cleanData.descripcion ? `'${cleanData.descripcion.replace(/'/g, "''")}'` : "NULL"}, 
              ${cleanData.rating}, 
              ${cleanData.imagen_url ? `'${cleanData.imagen_url.replace(/'/g, "''")}'` : "NULL"}, 
              ${cleanData.lat}, 
              ${cleanData.lng}, 
              '${cleanData.fuente}', 
              ${cleanData.activo}, 
              NOW(), 
              NOW()
            )
          `

          await executeQuery(insertQuery)
          results.insertados++
        }
      } catch (error) {
        console.error(`❌ Error procesando telo ${index + 1}:`, error)
        console.error(`Datos del telo:`, JSON.stringify(teloData, null, 2))
        results.errores++
      }
    }

    console.log(
      `✅ Búsqueda completada: ${results.insertados} insertados, ${results.actualizados} actualizados, ${results.errores} errores`,
    )

    // Obtener los telos para devolver
    const finalTelosQuery = `
      SELECT * FROM telos 
      WHERE ciudad ILIKE '%${ciudad}%' 
        AND activo = true 
      ORDER BY created_at DESC 
      LIMIT 50
    `

    const finalTelos = await executeQuery(finalTelosQuery)

    return NextResponse.json({
      success: true,
      message: "Búsqueda completada",
      telos: finalTelos,
      stats: results,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("❌ Error en búsqueda:", error)
    return NextResponse.json(
      {
        error: "Error en búsqueda",
        details: error instanceof Error ? error.message : String(error),
        telos: [],
      },
      { status: 500 },
    )
  }
}

function generateSlug(nombre: string): string {
  return nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}
