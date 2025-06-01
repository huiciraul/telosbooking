import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import type { Ciudad } from "@/lib/models"

export async function GET(request: NextRequest) {
  try {
    const query = `
      SELECT * FROM ciudades
      ORDER BY nombre ASC
    `

    const ciudades = await executeQuery<Ciudad[]>(query)

    return NextResponse.json(ciudades)
  } catch (error: any) {
    console.error("Error fetching ciudades:", error)
    return NextResponse.json(
      { error: "Error interno del servidor", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
