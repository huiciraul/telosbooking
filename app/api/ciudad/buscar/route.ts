import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import { generateSlug } from "@/utils/generate-slug"
import { ciudadSearchSchema } from "@/lib/models"

/**
 * POST /api/ciudad/buscar
 * Registra una búsqueda de ciudad y la crea si no existe
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ciudad, provincia } = ciudadSearchSchema.parse(body)

    const nombreNormalizado = ciudad.trim()
    const slug = generateSlug(nombreNormalizado)

    let ciudadRecord = await executeQuery<any[]>(
      `SELECT * FROM ciudades WHERE LOWER(nombre) = LOWER($1) OR slug = $2 LIMIT 1`,
      [nombreNormalizado, slug],
    )

    if (ciudadRecord.length === 0) {
      const insertQuery = `
        INSERT INTO ciudades (nombre, slug, provincia, busquedas, created_at, updated_at)
        VALUES ($1, $2, $3, 1, NOW(), NOW())
        RETURNING *
      `
      ciudadRecord = await executeQuery<any[]>(insertQuery, [nombreNormalizado, slug, provincia || null])

      console.log(`✅ Nueva ciudad creada: ${nombreNormalizado}`)
    } else {
      await executeQuery(`
        UPDATE ciudades SET busquedas = busquedas + 1, updated_at = NOW() WHERE id = $1
      `, [ciudadRecord[0].id])

      console.log(`📊 Búsqueda registrada para: ${nombreNormalizado} (total: ${ciudadRecord[0].busquedas + 1})`)
    }

    return NextResponse.json({
      success: true,
      ciudad: ciudadRecord[0],
      message: `Búsqueda registrada para ${nombreNormalizado}`,
    })
  } catch (error) {
    console.error("❌ Error en búsqueda de ciudad:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// Ejemplo de cómo debería ser la llamada a la API desde el cliente:
/*
await fetch("/api/ciudad/buscar", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    ciudad: cityName, // <-- debe ser 'ciudad'
    provincia: provinceName,
  }),
})
*/
