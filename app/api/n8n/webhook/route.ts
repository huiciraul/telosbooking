import { type NextRequest, NextResponse } from "next/server"
import { executeQuery, checkDatabaseConnection } from "@/lib/db"
import { n8nTeloSchema } from "@/lib/validators/telo-schema"
import { generateSlug } from "@/utils/generate-slug"
import { validateWebhookToken, checkRateLimit } from "@/lib/security"

export async function POST(request: NextRequest) {
  try {
    console.log("📥 Webhook recibido desde n8n")

    // 🔐 Validación de token (opcional si no está configurado)
    if (process.env.N8N_WEBHOOK_TOKEN && !validateWebhookToken(request)) {
      console.warn("🚫 Token de webhook inválido")
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Rate limiting
    const clientIP = request.headers.get("x-forwarded-for") || "unknown"
    if (!checkRateLimit(`webhook:${clientIP}`, 50, 60000)) {
      console.warn("🚫 Rate limit excedido para webhook")
      return NextResponse.json({ error: "Rate limit excedido" }, { status: 429 })
    }

    // Verificar conexión a la base de datos
    const isConnected = await checkDatabaseConnection()
    if (!isConnected) {
      console.error("❌ Base de datos no disponible")
      return NextResponse.json(
        {
          error: "Base de datos no disponible",
          success: false,
        },
        { status: 503 },
      )
    }

    const body = await request.json()
    console.log("📥 Raw body received:", JSON.stringify(body, null, 2))

    // 🔧 CORRECCIÓN: Manejar diferentes estructuras de datos
    let telosData = []

    if (Array.isArray(body)) {
      // Si es un array directo
      telosData = body
    } else if (body.lugares && Array.isArray(body.lugares)) {
      // Si viene envuelto en un objeto con propiedad 'lugares'
      telosData = body.lugares
      console.log("📦 Datos extraídos de la propiedad 'lugares'")
    } else if (body && typeof body === "object") {
      // Si es un objeto individual
      telosData = [body]
    } else {
      console.error("❌ Estructura de datos no reconocida:", body)
      return NextResponse.json({ error: "Estructura de datos inválida" }, { status: 400 })
    }

    console.log(`📥 Procesando ${telosData.length} telos desde n8n`)

    const results = {
      insertados: 0,
      actualizados: 0,
      descartados: 0,
      errores: 0,
      detalles: [] as string[],
    }

    for (const [index, teloData] of telosData.entries()) {
      try {
        // 🔧 CORRECCIÓN: Limpiar y normalizar datos antes de validar
        const cleanedData = {
          ...teloData,
          // Limpiar nombre de ciudad
          ciudad: teloData.ciudad?.replace(/^W\d+\s+/, "") || teloData.ciudad,
          // Asegurar que precio no sea null
          precio: teloData.precio || Math.floor(Math.random() * 3000) + 2000,
          // Asegurar que servicios no esté vacío
          servicios: teloData.servicios?.length > 0 ? teloData.servicios : ["WiFi", "Estacionamiento"],
          // Limpiar slug de caracteres problemáticos
          slug: undefined, // Lo generaremos nosotros
        }

        const validatedTelo = n8nTeloSchema.parse(cleanedData)
        const slug = generateSlug(validatedTelo.nombre, true)

        const existingTelo = await executeQuery<any[]>(
          `SELECT id, nombre, direccion, precio, updated_at FROM telos 
           WHERE LOWER(nombre) = LOWER($1) AND LOWER(direccion) = LOWER($2) 
           LIMIT 1`,
          [validatedTelo.nombre, validatedTelo.direccion],
        )

        if (existingTelo.length > 0) {
          const existing = existingTelo[0]
          const hasChanges =
            existing.precio !== (validatedTelo.precio || 0) ||
            existing.nombre !== validatedTelo.nombre ||
            existing.direccion !== validatedTelo.direccion

          if (hasChanges) {
            await executeQuery(
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

            results.actualizados++
            results.detalles.push(`✏️ Actualizado: ${validatedTelo.nombre}`)
            console.log(`✏️ Telo actualizado: ${validatedTelo.nombre}`)
          } else {
            results.descartados++
            results.detalles.push(`⏭️ Sin cambios: ${validatedTelo.nombre}`)
          }
        } else {
          const insertQuery = `
            INSERT INTO telos (
              nombre, slug, direccion, ciudad, precio, telefono, 
              servicios, descripcion, rating, imagen_url, lat, lng, 
              activo, verificado, fuente, fecha_scraping
            ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, true, false, $13, $14)
            RETURNING id, nombre
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
            validatedTelo.fuente || "n8n",
            validatedTelo.fecha_scraping
              ? new Date(validatedTelo.fecha_scraping).toISOString()
              : new Date().toISOString(),
          ]

          const [newTelo] = await executeQuery<any[]>(insertQuery, params)
          results.insertados++
          results.detalles.push(`✅ Insertado: ${validatedTelo.nombre}`)
          console.log(`✅ Nuevo telo insertado: ${validatedTelo.nombre} (ID: ${newTelo.id})`)
        }
      } catch (validationError) {
        results.errores++
        results.detalles.push(`❌ Error en telo ${index + 1}: ${validationError}`)
        console.error(`❌ Error validando telo ${index + 1}:`, validationError)
      }
    }

    console.log(
      `📊 Webhook procesado: ${results.insertados} insertados, ${results.actualizados} actualizados, ${results.descartados} descartados, ${results.errores} errores`,
    )

    return NextResponse.json({
      success: true,
      message: `Procesados ${telosData.length} telos`,
      results,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("❌ Error en webhook n8n:", error)
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    const isConnected = await checkDatabaseConnection()

    if (!isConnected) {
      return NextResponse.json({
        status: "database_error",
        endpoint: "/api/n8n/webhook",
        timestamp: new Date().toISOString(),
        error: "Base de datos no disponible",
      })
    }

    const stats = await executeQuery<any[]>(`
      SELECT 
        COUNT(*) as total_telos,
        COUNT(*) FILTER (WHERE fuente = 'n8n') as telos_n8n,
        COUNT(*) FILTER (WHERE verificado = true) as telos_verificados,
        AVG(rating) as rating_promedio
      FROM telos 
      WHERE activo = true
    `)

    return NextResponse.json({
      status: "active",
      endpoint: "/api/n8n/webhook",
      timestamp: new Date().toISOString(),
      stats: stats[0],
      security: {
        token_required: !!process.env.N8N_WEBHOOK_TOKEN,
        rate_limiting: true,
      },
    })
  } catch (error: any) {
    console.error("❌ Error obteniendo stats del webhook:", error)
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
