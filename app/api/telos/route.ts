import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { executeQuery } from "@/lib/db"

const querySchema = z.object({
  ciudad: z.string().optional(),
  barrio: z.string().optional(),
  amenities: z.string().optional(),
  precio_min: z.string().optional(),
  precio_max: z.string().optional(),
  limit: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = querySchema.parse(Object.fromEntries(searchParams))

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
  } catch (error) {
    console.error("❌ Error fetching telos:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

const createTeloSchema = z.object({
  nombre: z.string().min(1),
  direccion: z.string().min(1),
  ciudad: z.string().min(1),
  precio: z.number().positive(),
  telefono: z.string().optional(),
  servicios: z.array(z.string()).default([]),
  descripcion: z.string().optional(),
  rating: z.number().min(0).max(5).default(0),
  imagen_url: z.string().url().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = createTeloSchema.parse(body)

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
  } catch (error) {
    console.error("❌ Error creating telo:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
