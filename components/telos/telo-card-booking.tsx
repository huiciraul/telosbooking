import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Wifi, Car, Waves } from "lucide-react"

interface TeloCardProps {
  telo: {
    id: string
    nombre: string
    slug: string
    direccion: string
    ciudad: string
    precio: number
    rating: number
    servicios: string[]
    imagen_url?: string
    disponible?: boolean
  }
}

const serviceIcons: Record<string, any> = {
  wifi: Wifi,
  estacionamiento: Car,
  hidromasaje: Waves,
}

export function TeloCardBooking({ telo }: TeloCardProps) {
  return (
    <Link href={`/telo/${telo.slug}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow border border-gray-200">
        {/* Image */}
        <div className="aspect-[4/3] relative">
          {telo.imagen_url ? (
            <img
              src={telo.imagen_url || "/placeholder.svg?height=300&width=400&query=hotel exterior"}
              alt={telo.nombre}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <MapPin className="w-12 h-12 text-gray-400" />
            </div>
          )}

          {/* Availability badge */}
          {telo.disponible && <Badge className="absolute top-3 left-3 bg-green-600">Disponible</Badge>}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-900 text-lg">{telo.nombre}</h3>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium">{telo.rating}</span>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-3 flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            {telo.direccion}
          </p>

          {/* Services */}
          <div className="flex flex-wrap gap-1 mb-3">
            {telo.servicios.slice(0, 3).map((servicio) => (
              <Badge key={servicio} variant="secondary" className="text-xs">
                {servicio}
              </Badge>
            ))}
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xl font-bold text-gray-900">${telo.precio}</span>
              <span className="text-sm text-gray-600 ml-1">por turno</span>
            </div>
            <Badge variant="outline" className="text-green-600 border-green-600">
              Reservar
            </Badge>
          </div>
        </div>
      </Card>
    </Link>
  )
}
