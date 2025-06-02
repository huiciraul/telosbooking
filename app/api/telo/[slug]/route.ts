import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import { mockTelos } from "@/lib/models"
import type { Telo } from "@/lib/models"

interface RouteParams {
  params: { slug: string }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  console.log("API: Request received for slug:", params.slug)

  if (!params.slug) {
    return NextResponse.json({ error: "Slug requerido" }, { status: 400 })
  }

  try {
    const query = `
      SELECT * FROM telos 
      WHERE slug = $1 AND activo = true
      LIMIT 1
    `

    console.log("API: Executing query:", query, "with params:", [params.slug])
    const result = await executeQuery<Telo[]>(query, [params.slug])

    if (result.length > 0) {
      const telo = result[0]
      console.log("API: Telo found in DB:", telo.nombre)
      return NextResponse.json(telo)
    }

    // Si no se encuentra en BD, buscar en mock data
    const mockTelo = mockTelos.find((t) => t.slug === params.slug)
    if (mockTelo) {
      console.log("API: Telo found in mock data:", mockTelo.nombre)
      return NextResponse.json(mockTelo)
    }

    console.log("API: Telo not found for slug:", params.slug)
    return NextResponse.json({ error: "Telo no encontrado" }, { status: 404 })
  } catch (error: any) {
    console.error("API: Error in GET /api/telo/[slug]:", error)

    // Fallback a mock data en caso de error de BD
    const mockTelo = mockTelos.find((t) => t.slug === params.slug)
    if (mockTelo) {
      console.log("API: Using mock data as fallback:", mockTelo.nombre)
      return NextResponse.json(mockTelo)
    }

    return NextResponse.json(
      { error: "Error interno del servidor", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
