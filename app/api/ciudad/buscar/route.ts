import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { executeQuery } from "@/lib/db"
import { generateSlug } from "@/utils/generate-slug"

const buscarCiudadSchema = z.object({
  nombre: z.string().min(1, "El nombre de la ciudad es requerido"),
  provincia: z.string().optional(),
})

/**
 * POST /api/ciudad/buscar
 * Registra una búsqueda de ciudad y la crea si no existe
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nombre, provincia } = buscarCiudadSchema.parse(body)

    // Normalizar nombre de ciudad
    const nombreNormalizado = nombre.trim()
    const slug = generateSlug(nombreNormalizado)

    // Buscar si la ciudad ya existe
    let ciudad = await executeQuery<any[]>(
      `SELECT * FROM ciudades WHERE LOWER(nombre) = LOWER($1) OR slug = $2 LIMIT 1`,
      [nombreNormalizado, slug],
    )

    if (ciudad.length === 0) {
      // Crear nueva ciudad si no existe
      const insertQuery = `
        INSERT INTO ciudades (nombre, slug, provincia, busquedas) 
        VALUES ($1, $2, $3, 1)
        RETURNING *
      `
      ciudad = await executeQuery<any[]>(insertQuery, [nombreNormalizado, slug, provincia || null])

      console.log(`✅ Nueva ciudad creada: ${nombreNormalizado}`)
    } else {
      // Incrementar contador de búsquedas
      await executeQuery(`UPDATE ciudades SET busquedas = busquedas + 1 WHERE id = $1`, [ciudad[0].id])

      console.log(`📊 Búsqueda registrada para: ${nombreNormalizado} (total: ${ciudad[0].busquedas + 1})`)
    }

    return NextResponse.json({
      success: true,
      ciudad: ciudad[0],
      message: `Búsqueda registrada para ${nombreNormalizado}`,
    })
  } catch (error) {
    console.error("❌ Error en búsqueda de ciudad:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
