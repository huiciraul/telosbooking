import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

/**
 * GET /api/telos/check?ciudad=nombre
 * Verifica si ya existen telos para una ciudad específica
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const ciudad = url.searchParams.get("ciudad")

  if (!ciudad) {
    return NextResponse.json({ error: "Falta el parámetro ciudad" }, { status: 400 })
  }

  try {
    // Verificar si existen telos para esta ciudad
    const query = `
      SELECT COUNT(*) as total 
      FROM telos 
      WHERE LOWER(ciudad) LIKE LOWER($1)
    `
    const result = await executeQuery(query, [`%${ciudad}%`])

    const total = Number.parseInt(result[0]?.total || "0")

    return NextResponse.json({
      exists: total > 0,
      total,
      ciudad,
    })
  } catch (error) {
    console.error("❌ Error verificando telos para ciudad:", error)
    return NextResponse.json(
      {
        error: "Error verificando telos",
        exists: false,
        ciudad,
      },
      { status: 500 },
    )
  }
}
