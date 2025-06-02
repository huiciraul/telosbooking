import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import type { Telo } from "@/lib/models"

interface RouteParams {
  params: { slug: string }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  console.log("API: Request received for slug:", params.slug)
  try {
    const query = `
      SELECT * FROM telos 
      WHERE slug = $1 AND activo = true
      LIMIT 1
    `

    console.log("API: Executing query:", query, "with params:", [params.slug])
    const [telo] = await executeQuery<Telo[]>(query, [params.slug])

    console.log("API: Raw telo object from DB:", telo) // Log the raw object

    if (!telo) {
      console.log("API: Telo not found for slug:", params.slug)
      return NextResponse.json({ error: "Telo no encontrado" }, { status: 404 })
    }

    console.log("API: Telo found:", telo.nombre) // Log the name if found
    return NextResponse.json(telo)
  } catch (error: any) {
    console.error("API: Error in GET /api/telo/[slug]:", error)
    console.error("Error fetching telo:", error)
    return NextResponse.json(
      { error: "Error interno del servidor", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
