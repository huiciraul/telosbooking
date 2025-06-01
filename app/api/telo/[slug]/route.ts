import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import type { Telo } from "@/lib/models"

interface RouteParams {
  params: { slug: string }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const query = `
      SELECT * FROM telos 
      WHERE slug = $1 AND activo = true
      LIMIT 1
    `

    const [telo] = await executeQuery<Telo[]>(query, [params.slug])

    if (!telo) {
      return NextResponse.json({ error: "Telo no encontrado" }, { status: 404 })
    }

    return NextResponse.json(telo)
  } catch (error: any) {
    console.error("Error fetching telo:", error)
    return NextResponse.json(
      { error: "Error interno del servidor", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
