import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function GET() {
  try {
    // Obtener estadísticas generales
    const [stats] = await executeQuery<any[]>(`
      SELECT 
        (SELECT COUNT(*) FROM telos WHERE activo = true) as total_telos,
        (SELECT COUNT(*) FROM ciudades) as total_ciudades,
        (SELECT COUNT(*) FROM telos WHERE verificado = true) as telos_verificados,
        (SELECT AVG(rating) FROM telos WHERE activo = true) as rating_promedio,
        (SELECT COUNT(*) FROM telos WHERE fuente = 'n8n') as telos_n8n,
        (SELECT SUM(busquedas) FROM ciudades) as total_busquedas
    `)

    // Obtener ciudades más populares
    const ciudadesPopulares = await executeQuery<any[]>(`
      SELECT nombre, busquedas, 
        (SELECT COUNT(*) FROM telos WHERE ciudad = ciudades.nombre AND activo = true) as total_telos
      FROM ciudades 
      WHERE busquedas > 0
      ORDER BY busquedas DESC
      LIMIT 5
    `)

    // Obtener telos mejor valorados
    const telosTop = await executeQuery<any[]>(`
      SELECT nombre, rating, ciudad, precio
      FROM telos 
      WHERE activo = true AND rating > 0
      ORDER BY rating DESC, nombre ASC
      LIMIT 5
    `)

    return NextResponse.json({
      success: true,
      stats,
      ciudadesPopulares,
      telosTop,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
