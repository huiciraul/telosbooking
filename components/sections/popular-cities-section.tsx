"use client"

import { useState, useEffect } from "react"
import Link from "next/link" // <-- Corregido: importación de Link desde next/link
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Building2 } from "lucide-react"

interface Ciudad {
  id: number
  nombre: string
  slug: string
  provincia?: string
  busquedas?: number
  total_telos?: number
}

export function PopularCitiesSection() {
  const [cities, setCities] = useState<Ciudad[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPopularCities = async () => {
      try {
        const response = await fetch("/api/ciudades/populares")
        if (response.ok) {
          const data = await response.json()
          setCities(data.data || [])
        }
      } catch (error) {
        console.error("Error fetching popular cities:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPopularCities()
  }, [])

  if (loading) {
    return (
      <section className="px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ciudades Populares</h2>
            <p className="text-gray-600">Explorá telos en las ciudades más buscadas</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-xl"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (cities.length === 0) {
    return null
  }

  return (
    <section className="px-4 py-12 bg-gradient-to-br from-purple-50/50 to-blue-50/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ciudades Populares</h2>
          <p className="text-gray-600">Explorá telos en las ciudades más buscadas de Argentina</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cities.slice(0, 8).map((city) => (
            <Link key={city.id} href={`/telos-en/${city.slug}`}>
              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-purple-100">
                <CardContent className="p-4 text-center">
                  <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
                    {city.nombre}
                  </h3>
                  {city.provincia && <p className="text-sm text-gray-500 mb-2">{city.provincia}</p>}
                  {city.total_telos && (
                    <div className="flex items-center justify-center text-sm text-purple-600">
                      <Building2 className="w-4 h-4 mr-1" />
                      <span>{city.total_telos} telos</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
