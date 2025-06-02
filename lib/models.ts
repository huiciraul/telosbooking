import { z } from "zod"

// Definición del esquema para un Telo, usado para validación y tipado
export const teloSchema = z.object({
  id: z.string(), // Asegúrate de que el ID sea un string para coincidir con la base de datos (cuid())
  nombre: z.string().min(1, "El nombre es requerido."),
  slug: z.string().min(1, "El slug es requerido."),
  direccion: z.string().min(1, "La dirección es requerida."),
  ciudad: z.string().min(1, "La ciudad es requerida."),
  precio: z.number().min(0, "El precio debe ser un número positivo.").nullable(),
  telefono: z.string().nullable(),
  servicios: z.array(z.string()).default([]),
  descripcion: z.string().nullable(),
  rating: z.number().min(0).max(5).nullable(),
  imagen_url: z.string().url("URL de imagen inválida.").nullable(),
  lat: z.number().nullable(),
  lng: z.number().nullable(),
  activo: z.boolean().default(true),
  verificado: z.boolean().default(false),
  fuente: z.string().nullable(),
  fecha_scraping: z.string().datetime().nullable(),
  created_at: z.string().datetime().nullable(),
  updated_at: z.string().datetime().nullable(),
})

export type Telo = z.infer<typeof teloSchema>

// Esquema específico para los datos que vienen de n8n
export const n8nTeloSchema = z.object({
  nombre: z.string().min(1),
  slug: z.string().optional(), // n8n puede enviarlo, pero lo generaremos nosotros
  direccion: z.string().min(1),
  ciudad: z.string().min(1),
  precio: z.number().nullable().default(0),
  telefono: z.string().nullable().default(null),
  servicios: z.array(z.string()).default([]),
  descripcion: z.string().nullable().default(null),
  rating: z.number().nullable().default(0),
  imagen_url: z.string().url().nullable().default(null),
  lat: z.number().nullable().default(null),
  lng: z.number().nullable().default(null),
  fuente: z.string().nullable().default("n8n"),
  fecha_scraping: z.string().datetime().nullable().default(new Date().toISOString()),
})

export type N8nTelo = z.infer<typeof n8nTeloSchema>

// Esquema para la búsqueda de ciudades
export const ciudadSearchSchema = z.object({
  ciudad: z.string().min(1, "La ciudad es requerida."),
})

export type CiudadSearch = z.infer<typeof ciudadSearchSchema>
