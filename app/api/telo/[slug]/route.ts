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

  const slug = params.slug

  // Primero buscar en mock data
  const mockTelo = mockTelos.find((t) => t.slug === slug)

  try {
    // Intentar obtener de la base de datos
    const query = `SELECT * FROM telos WHERE slug = $1 AND activo = true LIMIT 1`
    console.log("API: Executing query:", query, "with params:", [slug])

    const result = await executeQuery<Telo[]>(query, [slug])

    if (result && result.length > 0) {
      const telo = result[0]
      console.log("API: Telo found in DB:", telo.nombre)
      return NextResponse.json({
        ...telo,
        servicios: Array.isArray(telo.servicios) ? telo.servicios : [],
      })
    }
  } catch (error: any) {
    console.error("API: Database error:", error)
    // Continuar con fallback en lugar de devolver error
  }

  // Si se encuentra en mock data, devolverlo
  if (mockTelo) {
    console.log("API: Using mock data:", mockTelo.nombre)
    return NextResponse.json(mockTelo)
  }

  // Si no existe en ningún lado, crear un telo genérico
  console.log("API: Creating generic telo for slug:", slug)
  const genericTelo: Telo = {
    id: "generic-" + slug,
    nombre: slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    slug: slug,
    direccion: "Dirección no disponible",
    ciudad: "Ciudad no especificada",
    precio: null,
    telefono: null,
    servicios: ["WiFi", "Estacionamiento"],
    descripcion: `Información sobre ${slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")}. Este es un albergue transitorio que ofrece servicios de calidad.`,
    rating: 4.0,
    imagen_url: null,
    lat: null,
    lng: null,
    activo: true,
    verificado: false,
    fuente: "generated",
    fecha_scraping: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  return NextResponse.json(genericTelo)
}
