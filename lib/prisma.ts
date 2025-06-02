// Comentar temporalmente Prisma y usar datos mock
/*
import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as \{
  prisma: PrismaClient | undefined
\}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
*/

// Datos mock temporales para testing
// En mockTelos, cambiar 'imagen' a 'imagen_url' para cada objeto
// Ejemplo:
// imagen: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400&auto=format&fit=crop",
// DEBE SER:
// imagen_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400&auto=format&fit=crop",

export const mockTelos = [
  {
    id: 1, // Cambiado a number
    nombre: "Hotel Palermo",
    slug: "hotel-palermo",
    direccion: "Av. Santa Fe 3000",
    ciudad: "Buenos Aires",
    precio: 3500,
    telefono: "011-4555-1234",
    servicios: ["WiFi", "Estacionamiento", "Hidromasaje"],
    descripcion: "Moderno hotel en el corazón de Palermo",
    rating: 4.5,
    imagen_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400&auto=format&fit=crop",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2, // Cambiado a number
    nombre: "Albergue Villa Crespo",
    slug: "albergue-villa-crespo",
    direccion: "Corrientes 4500",
    ciudad: "Buenos Aires",
    precio: 2800,
    telefono: "011-4777-5678",
    servicios: ["WiFi", "Aire Acondicionado"],
    descripcion: "Cómodo albergue en Villa Crespo",
    rating: 4.2,
    imagen_url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=400&auto=format&fit=crop",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3, // Cambiado a number
    nombre: "Motel Belgrano",
    slug: "motel-belgrano",
    direccion: "Cabildo 2200",
    ciudad: "Buenos Aires",
    precio: 4200,
    telefono: "011-4888-9012",
    servicios: ["Estacionamiento", "Jacuzzi", "TV Cable"],
    descripcion: "Elegante motel en Belgrano",
    rating: 4.7,
    imagen_url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=400&auto=format&fit=crop",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 4, // Cambiado a number
    nombre: "Hotel Córdoba Centro",
    slug: "hotel-cordoba-centro",
    direccion: "San Martín 150",
    ciudad: "Córdoba",
    precio: 2500,
    telefono: "0351-422-3456",
    servicios: ["WiFi", "Frigobar"],
    descripcion: "Hotel céntrico en Córdoba",
    rating: 4.0,
    imagen_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400&auto=format&fit=crop",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 5, // Cambiado a number
    nombre: "Albergue Rosario",
    slug: "albergue-rosario",
    direccion: "Pellegrini 1200",
    ciudad: "Rosario",
    precio: 2200,
    telefono: "0341-455-7890",
    servicios: ["WiFi", "Estacionamiento"],
    descripcion: "Albergue moderno en Rosario",
    rating: 4.3,
    imagen_url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=400&auto=format&fit=crop",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export const mockCiudades = [
  { id: 1, nombre: "Buenos Aires", slug: "buenos-aires" }, // Cambiado a number
  { id: 2, nombre: "Córdoba", slug: "cordoba" }, // Cambiado a number
  { id: 3, nombre: "Rosario", slug: "rosario" }, // Cambiado a number
  { id: 4, nombre: "Mendoza", slug: "mendoza" }, // Cambiado a number
  { id: 5, nombre: "La Plata", slug: "la-plata" }, // Cambiado a number
  { id: 6, nombre: "Mar del Plata", slug: "mar-del-plata" }, // Cambiado a number
]
