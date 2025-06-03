import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    console.log("🎯 Webhook recibido de n8n")

    // Verificar autorización
    const authHeader = request.headers.get("authorization")
    const expectedToken = process.env.N8N_WEBHOOK_TOKEN

    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      console.error("❌ Token de autorización inválido")
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    console.log("📥 Datos recibidos:", JSON.stringify(body, null, 2))

    // Manejar diferentes formatos de datos
    let telosData = []

    if (Array.isArray(body)) {
      telosData = body
    } else if (body.telos && Array.isArray(body.telos)) {
      telosData = body.telos
    } else if (body.data && Array.isArray(body.data)) {
      telosData = body.data
    } else {
      // Si es un solo telo, convertir a array
      telosData = [body]
    }

    console.log(`📊 Procesando ${telosData.length} telos`)

    if (telosData.length === 0) {
      console.log("⚠️ No hay datos de telos para procesar")
      return NextResponse.json({
        message: "No hay datos para procesar",
        received: body,
        success: true,
      })
    }

    let insertedCount = 0
    let skippedCount = 0
    let errorCount = 0

    for (const teloData of telosData) {
      try {
        // Validar datos mínimos
        if (!teloData.nombre || !teloData.direccion || !teloData.ciudad) {
          console.log("⚠️ Telo sin datos mínimos:", teloData)
          skippedCount++
          continue
        }

        // Limpiar y normalizar datos - SIN GENERAR PRECIOS
        const cleanData = {
          nombre: String(teloData.nombre).trim().replace(/['"]/g, ""),
          slug: teloData.slug || generateSlug(teloData.nombre),
          direccion: String(teloData.direccion).trim(),
          ciudad: String(teloData.ciudad).trim(),
          telefono: teloData.telefono || null,
          precio: null, // SIEMPRE NULL - NO GENERAR PRECIOS
          servicios: Array.isArray(teloData.servicios) ? teloData.servicios : ["WiFi"],
          descripcion: teloData.descripcion || `${teloData.nombre} ubicado en ${teloData.direccion}`,
          rating: null, // También NULL para evitar ratings falsos
          imagen_url: teloData.imagen_url || null,
          lat: teloData.lat || null,
          lng: teloData.lng || null,
          fuente: "n8n-scraping",
          activo: true,
        }

        console.log("💾 Insertando telo SIN PRECIO:", cleanData.nombre)

        // Insertar en base de datos con ON CONFLICT
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
          ON CONFLICT (LOWER(TRIM(nombre)), LOWER(TRIM(direccion)), LOWER(TRIM(ciudad))) 
          DO UPDATE SET 
            updated_at = NOW(),
            fuente = EXCLUDED.fuente,
            imagen_url = COALESCE(EXCLUDED.imagen_url, telos.imagen_url),
            lat = COALESCE(EXCLUDED.lat, telos.lat),
            lng = COALESCE(EXCLUDED.lng, telos.lng)
        `

        insertedCount++
      } catch (error) {
        console.error("❌ Error insertando telo:", error)
        errorCount++
      }
    }

    console.log(`✅ Procesamiento completado:`)
    console.log(`   - Insertados/Actualizados: ${insertedCount}`)
    console.log(`   - Omitidos: ${skippedCount}`)
    console.log(`   - Errores: ${errorCount}`)

    return NextResponse.json({
      success: true,
      message: "Datos procesados correctamente",
      stats: {
        total: telosData.length,
        inserted: insertedCount,
        skipped: skippedCount,
        errors: errorCount,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Error en webhook:", error)
    return NextResponse.json(
      {
        error: "Error procesando webhook",
        details: error instanceof Error ? error.message : "Error desconocido",
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

export async function GET() {
  return NextResponse.json({
    status: "Webhook activo - SIN GENERACION DE PRECIOS",
    timestamp: new Date().toISOString(),
  })
}
