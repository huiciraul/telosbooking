import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import { generateSlug } from "@/utils/generate-slug"
import { n8nTeloSchema } from "@/lib/models"

export async function POST(req: Request) {
  try {
    const { ciudad } = await req.json()
    if (!ciudad) {
      return NextResponse.json({ error: "Ciudad es requerida" }, { status: 400 })
    }

    const slug = generateSlug(ciudad)

    // Asegurarse que la ciudad exista o crearla
    const ciudadResult = await executeQuery(`SELECT id FROM ciudades WHERE slug = $1 LIMIT 1`, [slug])

    let ciudadId: number | null = null

    if (ciudadResult.length === 0) {
      const insertCity = await executeQuery(
        `INSERT INTO ciudades (nombre, slug, busquedas, created_at, updated_at)
         VALUES ($1, $2, 1, NOW(), NOW()) RETURNING id`,
        [ciudad, slug],
      )
      ciudadId = insertCity[0].id
    } else {
      ciudadId = ciudadResult[0].id
      await executeQuery(`UPDATE ciudades SET busquedas = busquedas + 1, updated_at = NOW() WHERE id = $1`, [ciudadId])
    }

    // Llamada al webhook de n8n
    const webhookUrl = "https://n8ndev.reifdev.com/webhook/buscar-telos-scrapping"
    console.log(`[n8n/search] Llamando a n8n webhook: ${webhookUrl} para ciudad: ${ciudad}`)
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ciudad }),
    })

    if (!response.ok) {
      const errorDetails = await response.text()
      console.error(`[n8n/search] Error de n8n webhook (${response.status}): ${errorDetails}`)
      return NextResponse.json(
        { error: "Error al buscar telos online", details: errorDetails },
        { status: response.status },
      )
    }

    const data = await response.json()
    const telosFromN8n =
      Array.isArray(data?.telos) ? data.telos :
      Array.isArray(data) && Array.isArray(data[0]?.telos) ? data[0].telos :
      []
    console.log(`[n8n/search] Recibidos ${telosFromN8n.length} telos de n8n.`)

    const stats = { insertados: 0, actualizados: 0, errores: 0 }

    for (const rawOriginal of telosFromN8n) {
      // Clonar para no mutar el original
      const raw = { ...rawOriginal }

      // Normalizar precio: convertir string a número si es necesario
      if (typeof raw.precio === "string") {
        const match = raw.precio.match(/(\d+([.,]\d+)?)/)
        raw.precio = match ? Number(match[1].replace(",", ".")) : null
      }

      const parsed = n8nTeloSchema.safeParse(raw)
      if (!parsed.success) {
        stats.errores++
        console.error("[n8n/search] Error de validación Zod:", parsed.error.errors, "Datos raw:", raw)
        continue
      }

      // Generar slug si no viene
      const telo = {
        ...parsed.data,
        ciudad: parsed.data.ciudad || ciudad,
        slug: parsed.data.slug || generateSlug(parsed.data.nombre),
      }

      const exists = await executeQuery(
        `SELECT id FROM telos WHERE LOWER(nombre) = LOWER($1) AND LOWER(direccion) = LOWER($2) LIMIT 1`,
        [telo.nombre, telo.direccion],
      )

      if (exists.length > 0) {
        console.log(`[n8n/search] Actualizando telo existente: ${telo.nombre}`)
        await executeQuery(
          `UPDATE telos SET
            updated_at = NOW(),
            fuente = $1,
            servicios = $2,
            imagen_url = COALESCE($3, imagen_url),
            lat = COALESCE($4, lat),
            lng = COALESCE($5, lng),
            rating = COALESCE($6, rating),
            provincia = $7,
            pais = $8,
            telefono = $9,
            descripcion = $10,
            fecha_scraping = $11,
            ciudad_id = $12
           WHERE id = $13`,
          [
            telo.fuente,
            telo.servicios, // CORREGIDO: Pasar array directamente
            telo.imagen_url,
            telo.lat,
            telo.lng,
            telo.rating,
            telo.provincia,
            telo.pais,
            telo.telefono,
            telo.descripcion,
            telo.fecha_scraping,
            ciudadId,
            exists[0].id,
          ],
        )
        stats.actualizados++
      } else {
        console.log(`[n8n/search] Insertando nuevo telo: ${telo.nombre}`)
        await executeQuery(
          `INSERT INTO telos (nombre, slug, direccion, ciudad, ciudad_id, provincia, pais, telefono, precio,
           servicios, descripcion, rating, imagen_url, lat, lng, fuente, activo, created_at, updated_at, fecha_scraping)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
                   $11, $12, $13, $14, $15, $16, true, NOW(), NOW(), $17)`,
          [
            telo.nombre,
            telo.slug,
            telo.direccion,
            telo.ciudad,
            ciudadId,
            telo.provincia,
            telo.pais,
            telo.telefono,
            telo.precio,
            telo.servicios, // CORREGIDO: Pasar array directamente
            telo.descripcion,
            telo.rating,
            telo.imagen_url,
            telo.lat,
            telo.lng,
            telo.fuente,
            telo.fecha_scraping,
          ],
        )
        stats.insertados++
        await executeQuery(
          `UPDATE ciudades SET total_telos = COALESCE(total_telos, 0) + 1, updated_at = NOW() WHERE id = $1`,
          [ciudadId],
        )
      }
    }

    const finalTelos = await executeQuery(
      `SELECT * FROM telos WHERE ciudad ILIKE $1 AND activo = true ORDER BY created_at DESC LIMIT 50`,
      [`%${ciudad}%`],
    )

    console.log(`[n8n/search] Búsqueda completada para ${ciudad}. Stats: ${JSON.stringify(stats)}`)
    return NextResponse.json({
      success: true,
      message: "Búsqueda completada",
      telos: finalTelos,
      stats,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("[n8n/search] Error interno del servidor:", error)
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        details: error instanceof Error ? error.message : String(error),
        telos: [],
      },
      { status: 500 },
    )
  }
}
