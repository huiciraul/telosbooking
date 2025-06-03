"use client"

import { useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Star, MapPin, Wifi, Car, Waves, Phone } from "lucide-react"
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

  return (
    <Card className="overflow-hidden bg-white rounded-2xl shadow-sm border-0 hover:shadow-lg transition-all duration-300 animate-fade-in group">
      <Link href={`/telo/${telo.slug}`} className="block">
        <div className="relative">
          {/* Image */}
          <div className="relative w-full h-48 md:h-40 lg:h-48">
            {telo.imagen_url ? (
              <img
                src={telo.imagen_url || "/placeholder.svg?height=192&width=300&query=hotel exterior"}
                alt={telo.nombre}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <p className="text-purple-600 font-medium text-sm">Albergue Transitorio</p>
                </div>
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
              className="absolute top-2 right-2 w-8 h-8 p-0 rounded-full bg-white/90 hover:bg-white shadow-sm"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
            </Button>

            {/* Rating badge */}
            {telo.rating > 0 && (
              <div className="absolute top-2 left-2 bg-white/90 rounded-full px-2 py-1 flex items-center space-x-1">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span className="text-xs font-medium text-gray-700">{telo.rating}</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="mb-2">
              <h3 className="font-semibold text-gray-900 text-base leading-tight group-hover:text-purple-600 transition-colors">
                {telo.nombre}
              </h3>
              <p className="text-sm text-gray-500 mt-1 flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                {telo.direccion.split(",")[0]}
              </p>
            </div>

            {/* Services */}
            <div className="flex items-center space-x-2 mb-3">
              {telo.servicios.slice(0, 4).map((servicio) => {
                const Icon = serviceIcons[servicio.toLowerCase()] || Wifi
                return (
                  <div
                    key={servicio}
                    className="w-6 h-6 bg-purple-50 rounded-full flex items-center justify-center"
                    title={servicio}
                  >
                    <Icon className="w-3 h-3 text-purple-600" />
                  </div>
                )
              })}
              {telo.servicios.length > 4 && (
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  +{telo.servicios.length - 4}
                </span>
              )}
            </div>

            {/* Price and actions */}
            <div className="flex items-center justify-between">
              <div>
                {telo.precio ? (
                  <>
                    <span className="text-lg font-bold text-gray-900">${telo.precio}</span>
                    <span className="text-xs text-gray-500 ml-1">por turno</span>
                  </>
                ) : (
                  <span className="text-sm font-medium text-gray-700">Consultar precio</span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {telo.telefono && (
                  <a
                    href={`tel:${telo.telefono}`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center justify-center px-2 py-1 text-sm border rounded-full text-gray-700 border-gray-300 hover:bg-gray-100"
                  >
                    <Phone className="w-3 h-3" />
                  </a>
                )}
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  )
}
