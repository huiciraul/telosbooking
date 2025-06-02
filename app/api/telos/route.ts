import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import { searchTelosSchema, teloSchema } from "@/lib/models"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchTelosSchema.parse(Object.fromEntries(searchParams))

    // Construir la consulta SQL base
    let sqlQuery = `
      SELECT * FROM telos 
      WHERE activo = true
    `
    const params: any[] = []

    // Filtrar por ciudad
    if (query.ciudad) {
      sqlQuery += ` AND LOWER(ciudad) LIKE LOWER($${params.length + 1})`
      params.push(`%${query.ciudad}%`)
    }

    // Filtrar por barrio (en dirección)
    if (query.barrio) {
      sqlQuery += ` AND LOWER(direccion) LIKE LOWER($${params.length + 1})`
      params.push(`%${query.barrio}%`)
    }

    // Filtrar por servicios
    if (query.amenities) {
      const amenitiesList = query.amenities.split(",")
      amenitiesList.forEach((amenity) => {
        sqlQuery += ` AND servicios @> ARRAY[$${params.length + 1}]::text[]`
        params.push(amenity.trim())
      })
    }

    // Filtrar por precio
    if (query.precio_min) {
      sqlQuery += ` AND precio >= $${params.length + 1}`
      params.push(Number.parseInt(query.precio_min))
    }

    if (query.precio_max) {
      sqlQuery += ` AND precio <= $${params.length + 1}`
      params.push(Number.parseInt(query.precio_max))
    }

    // Ordenar por rating
    sqlQuery += ` ORDER BY rating DESC, created_at DESC`

    // Limitar resultados
    const limit = query.limit ? Number.parseInt(query.limit) : 50
    sqlQuery += ` LIMIT $${params.length + 1}`
    params.push(limit)

    // Ejecutar la consulta
    const telos = await executeQuery(sqlQuery, params)

    return NextResponse.json(telos)
  } catch (error: any) {
    console.error("❌ Error fetching telos:", error)
    return NextResponse.json(
      { error: "Error interno del servidor", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = teloSchema.parse(body)

    // Generar slug desde el nombre
    const slug = data.nombre
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .trim()

    // Insertar en la base de datos
    const query = `
      INSERT INTO telos (
        nombre, slug, direccion, ciudad, precio, telefono, 
        servicios, descripcion, rating, imagen_url, lat, lng, 
        activo, verificado, fuente
      ) 
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, true, false, 'manual'
      )
      RETURNING *
    `

    const params = [
      data.nombre,
      slug,
      data.direccion,
      data.ciudad,
      data.precio,
      data.telefono || null,
      data.servicios,
      data.descripcion || null,
      data.rating,
      data.imagen_url || null,
      data.lat || null,
      data.lng || null,
    ]

    const [newTelo] = await executeQuery(query, params)

    return NextResponse.json(newTelo, { status: 201 })
  } catch (error: any) {
    console.error("❌ Error creating telo:", error)
    return NextResponse.json(
      { error: "Error interno del servidor", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
