import { z } from "zod"

export const createTeloSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  direccion: z.string().min(1, "La dirección es requerida"),
  ciudad: z.string().min(1, "La ciudad es requerida"),
  precio: z.number().positive("El precio debe ser positivo"),
  telefono: z.string().optional(),
  servicios: z.array(z.string()).default([]),
  descripcion: z.string().optional(),
  rating: z.number().min(0).max(5).default(0),
  imagen_url: z.string().url().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
})

export const n8nTeloSchema = z.object({
  nombre: z.string().min(1),
  direccion: z.string().min(1),
  ciudad: z.string().min(1),
  precio: z.number().positive().optional(),
  telefono: z.string().optional(),
  servicios: z.array(z.string()).default([]),
  descripcion: z.string().optional(),
  rating: z.number().min(0).max(5).optional(),
  imagen_url: z.string().url().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  fuente: z.string().optional(),
  fecha_scraping: z.string().optional(),
})

export const searchTelosSchema = z.object({
  ciudad: z.string().optional(),
  barrio: z.string().optional(),
  amenities: z.string().optional(),
  precio_min: z.string().optional(),
  precio_max: z.string().optional(),
  limit: z.string().optional(),
})
