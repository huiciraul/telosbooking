"use client"

import { useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Star, MapPin, Wifi, Car, Waves } from "lucide-react"
import type { Telo } from "@/lib/models"

interface TeloCardProps {
  telo: Telo
}

const serviceIcons: Record<string, any> = {
  wifi: Wifi,
  estacionamiento: Car,
  cochera: Car,
  hidromasaje: Waves,
  jacuzzi: Waves,
}

export function TeloCard({ telo }: TeloCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  // Asegurar que servicios es un array
  const servicios = Array.isArray(telo.servicios) ? telo.servicios : []

  return (
    <Card className="overflow-hidden bg-white rounded-2xl shadow-sm border-0 hover:shadow-lg transition-all duration-300 animate-fade-in">
      <Link href={`/telo/${telo.slug || ""}`}>
        <div className="flex">
          {/* Image */}
          <div className="relative w-24 h-24 flex-shrink-0">
            {telo.imagen_url ? (
              <img
                src={telo.imagen_url || "/placeholder.svg?height=96&width=96&query=hotel exterior"}
                alt={telo.nombre}
                className="w-full h-full object-cover rounded-l-2xl"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-100 to-purple-200 rounded-l-2xl flex items-center justify-center">
                <MapPin className="w-8 h-8 text-purple-400" />
              </div>
            )}

            {/* Favorite button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault()
                setIsFavorite(!isFavorite)
              }}
              className="absolute top-1 right-1 w-6 h-6 p-0 rounded-full bg-white/80 hover:bg-white"
            >
              <Heart className={`w-3 h-3 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-gray-900 text-sm leading-tight">{telo.nombre}</h3>
              <div className="flex items-center space-x-1 ml-2">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span className="text-xs font-medium text-gray-700">{telo.rating || 0}</span>
              </div>
            </div>

            <p className="text-xs text-gray-500 mb-2 flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              {telo.direccion?.split(",")[0] || telo.direccion}
            </p>

            {/* Services */}
            <div className="flex items-center space-x-1 mb-2">
              {Array.isArray(telo.servicios) &&
                telo.servicios.slice(0, 3).map((servicio) => {
                  const Icon = serviceIcons[servicio?.toLowerCase()] || Wifi
                  return (
                    <div key={servicio} className="w-5 h-5 bg-purple-50 rounded-full flex items-center justify-center">
                      <Icon className="w-3 h-3 text-purple-600" />
                    </div>
                  )
                })}
              {Array.isArray(telo.servicios) && telo.servicios.length > 3 && (
                <span className="text-xs text-gray-500">+{telo.servicios.length - 3}</span>
              )}
            </div>

            {/* Price */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-lg font-bold text-gray-900">${telo.precio || 0}</span>
                <span className="text-xs text-gray-500 ml-1">por turno</span>
              </div>
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  )
}
