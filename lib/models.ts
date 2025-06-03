import { z } from "zod"

// Definición del esquema para un Telo, usado para validación y tipado
export const teloSchema = z.object({
  id: z.string(),
  nombre: z.string().min(1, "El nombre es requerido."),
  slug: z.string().min(1, "El slug es requerido."),
  direccion: z.string().min(1, "La dirección es requerida."),
  ciudad: z.string().min(1, "La ciudad es requerida."),
  ciudad_id: z.number().nullable(), // Añadido ciudad_id
  provincia: z.string().nullable(), // Asegurado que existe
  pais: z.string().nullable(), // Asegurado que existe
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
  slug: z.string().optional(),
  direccion: z.string().min(1),
  ciudad: z.string().min(1),
  provincia: z.string().nullable().default(null), // Añadido provincia
  pais: z.string().nullable().default(null), // Añadido pais
  precio: z.number().nullable().optional(),
  telefono: z.string().nullable().default(null),
  servicios: z.array(z.string()).default([]),
  // Combinar descripcion y descripcion_hotel
  descripcion: z
    .string()
    .nullable()
    .default(null)
    .transform((val, ctx) => {
      // Acceder de forma segura a descripcion_hotel desde el objeto de entrada original (ctx.parent)
      const rawData = ctx.parent as Record<string, any>
      const hotelDesc = rawData?.descripcion_hotel
      const genericDesc = "lodging, point_of_interest, establishment"

      if (hotelDesc && typeof hotelDesc === "string" && hotelDesc.trim() !== "") {
        return hotelDesc.trim()
      }
      if (
        val &&
        typeof val === "string" &&
        val.trim() !== "" &&
        val.trim().toLowerCase() !== genericDesc.toLowerCase()
      ) {
        return val.trim()
      }
      return null
    }),
  descripcion_hotel: z.string().nullable().optional(), // Campo original de n8n, se transformará en 'descripcion'
  puntuacion: z.number().nullable().optional(), // Campo original de n8n
  scrapeado_en: z.string().datetime().nullable().optional(), // Campo original de n8n

  rating: z
    .number()
    .nullable()
    .default(0)
    .transform((val, ctx) => {
      const rawData = ctx.parent as Record<string, any>
      const puntuacion = rawData?.puntuacion // Obtener puntuacion de la data cruda
      if (puntuacion !== undefined && puntuacion !== null && !isNaN(Number(puntuacion))) {
        const numPuntuacion = Number(puntuacion)
        if (numPuntuacion < 0) return 0
        if (numPuntuacion > 5) return 5
        return numPuntuacion
      }
      // Fallback al valor existente de 'rating' si 'puntuacion' no es válido
      if (val === null || val === undefined || isNaN(Number(val))) return 0
      if (Number(val) < 0) return 0
      if (Number(val) > 5) return 5
      return Number(val)
    }),

  fecha_scraping: z
    .string()
    .datetime()
    .nullable()
    .default(new Date().toISOString())
    .transform((val, ctx) => {
      const rawData = ctx.parent as Record<string, any>
      const scrapeadoEn = rawData?.scrapeado_en // Obtener scrapeado_en de la data cruda
      if (scrapeadoEn && typeof scrapeadoEn === "string") {
        try {
          // Intentar parsear como datetime, si falla, retornar el valor original o el default
          return new Date(scrapeadoEn).toISOString()
        } catch (e) {
          console.warn("Formato de fecha 'scrapeado_en' inválido:", scrapeadoEn)
        }
      }
      return val // Retornar el valor original si 'scrapeado_en' no es válido o no está presente
    }),
  imagen_url: z.string().url().nullable().default(null),
  lat: z.number().nullable().default(null),
  lng: z.number().nullable().default(null),
  fuente: z.string().nullable().default("n8n"),
})

export type N8nTelo = z.infer<typeof n8nTeloSchema>

// Esquema para la búsqueda de telos
export const searchTelosSchema = z.object({
  ciudad: z.string().optional(),
  barrio: z.string().optional(),
  amenities: z.string().optional(),
  precio_min: z.string().optional(),
  precio_max: z.string().optional(),
  limit: z.string().optional(),
})

export type SearchTelos = z.infer<typeof searchTelosSchema>

// Esquema para la búsqueda de ciudades
export const ciudadSearchSchema = z.object({
  ciudad: z.string().min(1, "La ciudad es requerida."),
  provincia: z.string().optional(),
})

export type CiudadSearch = z.infer<typeof ciudadSearchSchema>

// Definición de la interfaz Ciudad
export interface Ciudad {
  id: number // Cambiado a number para coincidir con la DB
  nombre: string
  slug: string
  provincia?: string
  busquedas?: number
  total_telos?: number // Añadido total_telos
  created_at?: Date
}

// Definición de la interfaz Review
export interface Review {
  id: number
  telo_id: string
  usuario_nombre: string
  rating: number
  comentario?: string
  created_at?: Date
}

// Definición de la interfaz Favorito
export interface Favorito {
  id: number
  usuario_id: string
  telo_id: string
  created_at?: Date
}

// Mock data para fallback y desarrollo (mantener si es necesario para desarrollo local)
export const mockTelos: Telo[] = [
  {
    id: "1",
    nombre: "Hotel Palermo Premium",
    slug: "hotel-palermo-premium",
    direccion: "Av. Santa Fe 3000",
    ciudad: "Buenos Aires",
    ciudad_id: 35, // Ejemplo de ciudad_id
    provincia: "Buenos Aires",
    pais: "Argentina",
    precio: null,
    telefono: "011-4555-1234",
    servicios: ["WiFi", "Estacionamiento", "Hidromasaje"],
    descripcion:
      "Hotel Palermo Premium es un albergue transitorio de lujo ubicado en el corazón de Palermo, Buenos Aires. Este telo premium ofrece habitaciones por horas con hidromasaje, WiFi gratuito y estacionamiento privado. Ideal para parejas que buscan un albergue temporario con máxima comodidad y discreción en una de las zonas más exclusivas de la ciudad.",
    rating: 4.5,
    imagen_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400&auto=format&fit=crop",
    lat: -34.5859,
    lng: -58.4074,
    activo: true,
    verificado: true,
    fuente: "manual",
    fecha_scraping: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    nombre: "Albergue Villa Crespo",
    slug: "albergue-villa-crespo",
    direccion: "Corrientes 4500",
    ciudad: "Buenos Aires",
    ciudad_id: 35,
    provincia: "Buenos Aires",
    pais: "Argentina",
    precio: null,
    telefono: "011-4777-5678",
    servicios: ["WiFi", "Aire Acondicionado"],
    descripcion:
      "Albergue Villa Crespo es un telo moderno y accesible en el vibrante barrio de Villa Crespo. Este albergue transitorio cuenta con aire acondicionado y WiFi gratuito, perfecto para parejas que buscan un albergue temporario cómodo y bien ubicado. Excelente relación calidad-precio en uno de los barrios más dinámicos de Buenos Aires.",
    rating: 4.2,
    imagen_url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=400&auto=format&fit=crop",
    lat: -34.597,
    lng: -58.433,
    activo: true,
    verificado: true,
    fuente: "manual",
    fecha_scraping: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    nombre: "Motel Belgrano Deluxe",
    slug: "motel-belgrano-deluxe",
    direccion: "Cabildo 2200",
    ciudad: "Buenos Aires",
    ciudad_id: 35,
    provincia: "Buenos Aires",
    pais: "Argentina",
    precio: null,
    telefono: "011-4888-9012",
    servicios: ["Estacionamiento", "Jacuzzi", "TV Cable"],
    descripcion:
      "Motel Belgrano Deluxe es un elegante albergue transitorio ubicado en el exclusivo barrio de Belgrano. Cuenta con jacuzzi privado, estacionamiento seguro y TV por cable. Perfecto para parejas que buscan una experiencia de lujo en un ambiente discreto y sofisticado.",
    rating: 4.7,
    imagen_url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=400&auto=format&fit=crop",
    lat: -34.5627,
    lng: -58.4583,
    activo: true,
    verificado: true,
    fuente: "manual",
    fecha_scraping: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    nombre: "Hotel Córdoba Centro",
    slug: "hotel-cordoba-centro",
    direccion: "San Martín 150",
    ciudad: "Córdoba",
    ciudad_id: 36,
    provincia: "Córdoba",
    pais: "Argentina",
    precio: null,
    telefono: "0351-422-3456",
    servicios: ["WiFi", "Frigobar"],
    descripcion:
      "Hotel céntrico en Córdoba con todas las comodidades para una estadía perfecta. Ubicado en el corazón de la ciudad, ofrece fácil acceso a los principales puntos de interés.",
    rating: 4.0,
    imagen_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400&auto=format&fit=crop",
    lat: -31.4201,
    lng: -64.1888,
    activo: true,
    verificado: true,
    fuente: "manual",
    fecha_scraping: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "5",
    nombre: "Albergue Rosario",
    slug: "albergue-rosario",
    direccion: "Pellegrini 1200",
    ciudad: "Rosario",
    ciudad_id: 37,
    provincia: "Santa Fe",
    pais: "Argentina",
    precio: null,
    telefono: "0341-455-7890",
    servicios: ["WiFi", "Estacionamiento"],
    descripcion:
      "Albergue moderno en Rosario con excelente ubicación y servicios de calidad. Perfecto para una escapada romántica en la ciudad del río.",
    rating: 4.3,
    imagen_url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=400&auto=format&fit=crop",
    lat: -32.9468,
    lng: -60.6393,
    activo: true,
    verificado: true,
    fuente: "manual",
    fecha_scraping: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "6",
    nombre: "Motel Mendoza",
    slug: "motel-mendoza",
    direccion: "Av. San Martín 500",
    ciudad: "Mendoza",
    ciudad_id: 41,
    provincia: "Mendoza",
    pais: "Argentina",
    precio: null,
    telefono: "0261-123-4567",
    servicios: ["WiFi", "Estacionamiento", "Aire Acondicionado"],
    descripcion:
      "Motel con vista a la montaña en Mendoza. Ambiente romántico con todas las comodidades para una experiencia inolvidable.",
    rating: 4.1,
    imagen_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400&auto=format&fit=crop",
    lat: -32.8895,
    lng: -68.8458,
    activo: true,
    verificado: true,
    fuente: "manual",
    fecha_scraping: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export const mockCiudades = [
  {
    id: 1,
    nombre: "Buenos Aires",
    slug: "buenos-aires",
    provincia: "Buenos Aires",
    busquedas: 150,
    total_telos: 45,
  },
  {
    id: 2,
    nombre: "Córdoba",
    slug: "cordoba",
    provincia: "Córdoba",
    busquedas: 89,
    total_telos: 23,
  },
  {
    id: 3,
    nombre: "Rosario",
    slug: "rosario",
    provincia: "Santa Fe",
    busquedas: 67,
    total_telos: 18,
  },
  {
    id: 4,
    nombre: "Mendoza",
    slug: "mendoza",
    provincia: "Mendoza",
    busquedas: 45,
    total_telos: 12,
  },
  {
    id: 5,
    nombre: "La Plata",
    slug: "la-plata",
    provincia: "Buenos Aires",
    busquedas: 34,
    total_telos: 8,
  },
  {
    id: 6,
    nombre: "Mar del Plata",
    slug: "mar-del-plata",
    provincia: "Buenos Aires",
    busquedas: 28,
    total_telos: 6,
  },
]
