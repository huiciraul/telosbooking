export interface Ciudad {
  id: string // Cambiado a string para coincidir con la base de datos
  nombre: string
  slug: string
  provincia?: string
  created_at?: Date
}

export interface Telo {
  id: string // CORRECCIÓN: Cambiado de number a string para coincidir con la base de datos (cuid())
  nombre: string
  slug: string
  direccion: string
  ciudad_id?: number
  ciudad: string
  precio: number
  telefono?: string
  servicios: string[]
  descripcion?: string
  rating: number
  imagen_url?: string
  lat?: number
  lng?: number
  activo: boolean
  verificado: boolean
  fuente?: string
  fecha_scraping?: Date
  created_at?: Date
  updated_at?: Date
}

export interface Review {
  id: number
  telo_id: string // Cambiado a string para coincidir con el id de Telo
  usuario_nombre: string
  rating: number
  comentario?: string
  created_at?: Date
}

export interface Favorito {
  id: number
  usuario_id: string
  telo_id: string // Cambiado a string para coincidir con el id de Telo
  created_at?: Date
}
