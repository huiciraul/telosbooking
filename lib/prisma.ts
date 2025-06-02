// Comentar temporalmente Prisma y usar datos mock
/*
import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as \{
  prisma: PrismaClient | undefined
\}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
*/

// Datos mock temporales para testing con descripciones SEO optimizadas
export const mockTelos = [
  {
    id: 1,
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
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
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
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    nombre: "Motel Belgrano Deluxe",
    slug: "motel-belgrano-deluxe",
    direccion: "Cabildo 2200",
    ciudad: "Buenos Aires",
    precio: 4200,
    telefono: "011-4888-9012",
    servicios: ["Estacionamiento", "Jacuzzi", "TV Cable"],
    descripcion:
      "Motel Belgrano Deluxe es un albergue transitorio de categoría superior en el elegante barrio de Belgrano. Este telo de lujo ofrece jacuzzi privado, TV por cable y estacionamiento seguro. Perfecto para parejas que buscan un albergue temporario exclusivo con todas las comodidades en una zona residencial premium de Buenos Aires.",
    rating: 4.7,
    imagen_url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=400&auto=format&fit=crop",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 4,
    nombre: "Hotel Córdoba Centro",
    slug: "hotel-cordoba-centro",
    direccion: "San Martín 150",
    ciudad: "Córdoba",
    precio: null, // Sin precio inventado
    telefono: null, // Sin teléfono
    servicios: ["WiFi", "Frigobar"],
    descripcion:
      "Hotel Córdoba Centro es un albergue transitorio céntrico en la ciudad de Córdoba. Este telo ofrece habitaciones por horas con WiFi gratuito y frigobar, ubicado estratégicamente en el centro histórico. Ideal para parejas que visitan Córdoba y buscan un albergue temporario con fácil acceso a los principales atractivos de la ciudad.",
    rating: 4.0,
    imagen_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400&auto=format&fit=crop",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 5,
    nombre: "Albergue Rosario",
    slug: "albergue-rosario",
    direccion: "Pellegrini 1200",
    ciudad: "Rosario",
    precio: 2200,
    telefono: "0341-455-7890",
    servicios: ["WiFi", "Estacionamiento"],
    descripcion:
      "Albergue Rosario es un telo moderno y funcional en el corazón de Rosario, Santa Fe. Este albergue transitorio ofrece WiFi gratuito y estacionamiento privado, perfecto para parejas que buscan un albergue temporario confiable y bien ubicado. Excelente opción para quienes visitan la ciudad más importante de Santa Fe.",
    rating: 4.3,
    imagen_url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=400&auto=format&fit=crop",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export const mockCiudades = [
  { id: 1, nombre: "Buenos Aires", slug: "buenos-aires" },
  { id: 2, nombre: "Córdoba", slug: "cordoba" },
  { id: 3, nombre: "Rosario", slug: "rosario" },
  { id: 4, nombre: "Mendoza", slug: "mendoza" },
  { id: 5, nombre: "La Plata", slug: "la-plata" },
  { id: 6, nombre: "Mar del Plata", slug: "mar-del-plata" },
]
