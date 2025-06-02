import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import type { Telo } from "@/lib/models"

interface RouteParams {
  params: { slug: string }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  console.log("API: Request received for slug:", params.slug)
  try {
    // 1. Intentar búsqueda exacta primero
    let query = `
      SELECT * FROM telos 
      WHERE slug = $1 AND activo = true
      LIMIT 1
    `
    console.log("API: Executing exact query:", query, "with params:", [params.slug])
    let result = await executeQuery<Telo[]>(query, [params.slug])
    let telo = result[0]

    // 2. Si no se encuentra, intentar búsqueda con LIKE para slugs con timestamp
    if (!telo) {
      query = `
        SELECT * FROM telos 
        WHERE slug LIKE $1 || '%' AND activo = true
        ORDER BY created_at DESC
        LIMIT 1
      `
      console.log("API: Exact match not found. Trying LIKE query:", query, "with params:", [params.slug])
      result = await executeQuery<Telo[]>(query, [params.slug])
      telo = result[0]
    }

    console.log("API: Raw telo object from DB:", telo) // Log the raw object

    if (!telo) {
      console.log("API: Telo not found for slug:", params.slug)

      // Try to find similar slugs for debugging
      const similarSlugs = await executeQuery<{ slug: string }[]>(`SELECT slug FROM telos WHERE slug LIKE $1 LIMIT 5`, [
        `%${params.slug}%`,
      ])
      console.log(
        "API: Similar slugs found:",
        similarSlugs.map((s) => s.slug),
      )

      return NextResponse.json(
        {
          error: "Telo no encontrado",
          slug: params.slug,
          similarSlugs: similarSlugs.map((s) => s.slug),
        },
        { status: 404 },
      )
    }

    console.log("API: Telo found:", telo.nombre) // Log the name if found
    return NextResponse.json(telo)
  } catch (error: any) {
    console.error("API: Error in GET /api/telo/[slug]:", error)
    return NextResponse.json(
      { error: "Error interno del servidor", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
