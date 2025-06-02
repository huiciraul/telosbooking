import { PrismaClient } from "@prisma/client"

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-unused-vars
  var prisma: PrismaClient | undefined
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  })

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma
}

// Mock data can remain for testing or specific fallbacks if needed,
// but the application will primarily use the prisma client above.

export const mockTelos = [
  {
    id: "1", // Assuming ID is string based on Prisma typical usage
    nombre: "Hotel Palermo Premium",
    slug: "hotel-palermo-premium",
    direccion: "Av. Santa Fe 3000",
    ciudad: "Buenos Aires",
    precio: 3500,
    telefono: "011-4555-1234",
    servicios: ["WiFi", "Estacionamiento", "Hidromasaje"],
    descripcion:
      "Hotel Palermo Premium es un albergue transitorio de lujo ubicado en el corazón de Palermo, Buenos Aires. Este telo premium ofrece habitaciones por horas con hidromasaje, WiFi gratuito y estacionamiento privado. Ideal para parejas que buscan un albergue temporario con máxima comodidad y discreción en una de las zonas más exclusivas de la ciudad.",
    rating: 4.5,
    imagen_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400&auto=format&fit=crop",
    lat: -34.5859, // Example coordinates
    lng: -58.4074,
    activo: true,
    verificado: true,
    fuente: "manual",
    fecha_scraping: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "2",
    nombre: "Albergue Villa Crespo",
    slug: "albergue-villa-crespo",
    direccion: "Corrientes 4500",
    ciudad: "Buenos Aires",
    precio: 2800,
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
    fecha_scraping: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
  },
  // Add more mock telos if needed, ensuring all fields from Telo type are present
]

export const mockCiudades = [
  {
    id: "1",
    nombre: "Buenos Aires",
    slug: "buenos-aires",
    provincia: "Buenos Aires",
    pais: "Argentina",
    imagen_url: "/placeholder.svg?width=400&height=300",
  },
  {
    id: "2",
    nombre: "Córdoba",
    slug: "cordoba",
    provincia: "Córdoba",
    pais: "Argentina",
    imagen_url: "/placeholder.svg?width=400&height=300",
  },
  {
    id: "3",
    nombre: "Rosario",
    slug: "rosario",
    provincia: "Santa Fe",
    pais: "Argentina",
    imagen_url: "/placeholder.svg?width=400&height=300",
  },
]
