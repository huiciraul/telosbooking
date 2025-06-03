import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

const searchSchema = z.object({
  ciudad: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ciudad } = searchSchema.parse(body)

    console.log(`🔍 Iniciando búsqueda para: ${ciudad} - SIN GENERAR PRECIOS`)

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

        // Limpiar datos - NUNCA GENERAR PRECIOS
        const cleanData = {
          nombre: String(teloData.nombre).trim(),
          slug: generateSlug(teloData.nombre),
          direccion: String(teloData.direccion).trim(),
          ciudad: String(teloData.ciudad || ciudad).trim(),
          telefono: teloData.telefono || null,
          precio: null, // SIEMPRE NULL
          servicios: Array.isArray(teloData.servicios) ? teloData.servicios : ["WiFi"],
          descripcion: teloData.descripcion || null,
          rating: null, // SIEMPRE NULL
          imagen_url: teloData.imagen_url || null,
          lat: teloData.lat || null,
          lng: teloData.lng || null,
          fuente: "n8n-search",
          activo: true,
        }

        console.log(`💾 Insertando telo SIN PRECIO: ${cleanData.nombre}`)

        // Verificar si existe
        const existing = await sql`
          SELECT id FROM telos 
          WHERE LOWER(TRIM(nombre)) = LOWER(TRIM(${cleanData.nombre}))
            AND LOWER(TRIM(direccion)) = LOWER(TRIM(${cleanData.direccion}))
          LIMIT 1
        `

        if (existing.length > 0) {
          // Actualizar sin tocar el precio
          await sql`
            UPDATE telos SET
              updated_at = NOW(),
              fuente = ${cleanData.fuente},
              imagen_url = COALESCE(${cleanData.imagen_url}, imagen_url),
              lat = COALESCE(${cleanData.lat}, lat),
              lng = COALESCE(${cleanData.lng}, lng)
            WHERE id = ${existing[0].id}
          `
          results.actualizados++
        } else {
          // Insertar nuevo telo SIN PRECIO
          await sql`
            INSERT INTO telos (
              nombre, slug, direccion, ciudad, telefono, precio, servicios, 
              descripcion, rating, imagen_url, lat, lng, fuente, activo, 
              created_at, updated_at
            ) VALUES (
              ${cleanData.nombre}, ${cleanData.slug}, ${cleanData.direccion}, 
              ${cleanData.ciudad}, ${cleanData.telefono}, ${cleanData.precio}, 
              ${JSON.stringify(cleanData.servicios)}, ${cleanData.descripcion}, 
              ${cleanData.rating}, ${cleanData.imagen_url}, ${cleanData.lat}, 
              ${cleanData.lng}, ${cleanData.fuente}, ${cleanData.activo}, 
              NOW(), NOW()
            )
          `
          results.insertados++
        }
      } catch (error) {
        console.error(`❌ Error procesando telo ${index + 1}:`, error)
        results.errores++
      }
    }

    console.log(
      `✅ Búsqueda completada SIN PRECIOS: ${results.insertados} insertados, ${results.actualizados} actualizados`,
    )

    return NextResponse.json({
      success: true,
      message: "Búsqueda completada sin generar precios",
      stats: results,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("❌ Error en búsqueda:", error)
    return NextResponse.json(
      {
        error: "Error en búsqueda",
        details: error instanceof Error ? error.message : String(error),
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
