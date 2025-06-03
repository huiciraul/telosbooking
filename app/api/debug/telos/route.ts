import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function GET() {
  try {
    console.log("🔍 Verificando datos de telos en la base de datos...")

    // Resultados parciales para devolver algo incluso si hay error en alguna consulta
    const results: any = {
      timestamp: new Date().toISOString(),
    }

    try {
      // Contar total de telos - consulta simple
      const totalTelosQuery = `SELECT COUNT(*) as total FROM telos`
      const totalTelos = await executeQuery(totalTelosQuery)
      results.total_telos = totalTelos[0]?.total || 0
    } catch (error) {
      console.error("Error contando telos:", error)
      results.total_telos_error = String(error)
    }

    try {
      // Contar telos por ciudad - consulta simple
      const telosPorCiudadQuery = `
        SELECT ciudad, COUNT(*) as cantidad 
        FROM telos 
        GROUP BY ciudad 
        ORDER BY cantidad DESC
        LIMIT 20
      `
      results.telos_por_ciudad = await executeQuery(telosPorCiudadQuery)
    } catch (error) {
      console.error("Error contando telos por ciudad:", error)
      results.telos_por_ciudad_error = String(error)
    }

    try {
      // Obtener algunos telos de ejemplo - consulta simple
      const ejemplosQuery = `
        SELECT id, nombre, ciudad, direccion
        FROM telos 
        LIMIT 5
      `
      results.ejemplos_telos = await executeQuery(ejemplosQuery)
    } catch (error) {
      console.error("Error obteniendo ejemplos:", error)
      results.ejemplos_error = String(error)
    }

    try {
      // Verificar tabla ciudades - consulta simple
      const ciudadesQuery = `
        SELECT nombre, slug
        FROM ciudades 
        LIMIT 10
      `
      results.ciudades = await executeQuery(ciudadesQuery)
    } catch (error) {
      console.error("Error obteniendo ciudades:", error)
      results.ciudades_error = String(error)
    }

    return NextResponse.json({
      success: true,
      data: results,
    })
  } catch (error) {
    console.error("❌ Error general verificando datos:", error)
    return NextResponse.json(
      {
        error: "Error verificando datos",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
