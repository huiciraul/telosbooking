import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function GET() {
  try {
    const query = `
      SELECT 
        id, nombre, slug, provincia, busquedas,
        (SELECT COUNT(*) FROM telos WHERE ciudad = ciudades.nombre AND activo = true) as total_telos
      FROM ciudades 
      ORDER BY busquedas DESC, nombre ASC
      LIMIT 20
    `

    const ciudades = await executeQuery(query)

    return NextResponse.json({
      success: true,
      data: ciudades,
      total: ciudades.length,
    })
  } catch (error: any) {
    console.error("❌ Error fetching ciudades populares:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
