"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Building2, TrendingUp } from "lucide-react"

interface Ciudad {
  id: number
  nombre: string
  slug: string
  provincia?: string
  busquedas?: number
  total_telos?: number
}

export function PopularDestinations() {
  const [ciudades, setCiudades] = useState<Ciudad[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCiudades = async () => {
      try {
        const response = await fetch("/api/ciudades/populares")
        if (response.ok) {
          const data = await response.json()
          // Solo mostrar ciudades que tienen telos
          const ciudadesConTelos = (data.data || []).filter(
            (ciudad: Ciudad) => ciudad.total_telos && ciudad.total_telos > 0,
          )
          setCiudades(ciudadesConTelos)
        }
      } catch (error) {
        console.error("Error fetching ciudades:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCiudades()
  }, [])

  if (loading) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Destinos populares</h2>
            <p className="text-gray-600">Descubre los mejores telos en las principales ciudades de Argentina</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-100 animate-pulse rounded-lg"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (ciudades.length === 0) {
    return null
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Destinos populares</h2>
          <p className="text-gray-600">Descubre los mejores telos en las principales ciudades de Argentina</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ciudades.slice(0, 6).map((ciudad, index) => {
            const images = [
              "https://images.unsplash.com/photo-1589909202802-8f4aadce1849?q=80&w=400&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=400&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=400&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1586276393635-5ecd8112165e?q=80&w=400&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1567696911980-2eed69a46042?q=80&w=400&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=400&auto=format&fit=crop",
            ]

            return (
              <Link key={ciudad.id} href={`/telos-en/${ciudad.slug}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 group">
                  <div className="relative">
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={images[index % images.length] || "/placeholder.svg"}
                        alt={ciudad.nombre}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Trending badge solo si tiene muchas búsquedas */}
                    {ciudad.busquedas && ciudad.busquedas > 10 && (
                      <Badge className="absolute top-3 right-3 bg-blue-600 hover:bg-blue-700">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Trending
                      </Badge>
                    )}

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Content overlay */}
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-xl font-bold mb-1">{ciudad.nombre}</h3>
                      {ciudad.provincia && <p className="text-sm text-gray-200 mb-2">{ciudad.provincia}</p>}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{ciudad.total_telos} telos</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Building2 className="w-4 h-4" />
                            <span>Disponibles</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* View all destinations */}
        <div className="text-center mt-8">
          <Link
            href="/destinos"
            className="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
          >
            Ver todos los destinos
          </Link>
        </div>
      </div>
    </section>
  )
}
