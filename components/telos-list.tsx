import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star, Wifi, Car, Waves } from "lucide-react"

interface Telo {
  id: string
  nombre: string
  direccion: string
  ciudad: string
  precio: number
  rating: number
  servicios: string[]
  slug: string
  imagen?: string
}

interface TelosListProps {
  telos: Telo[]
}

const serviceIcons: Record<string, any> = {
  wifi: Wifi,
  estacionamiento: Car,
  hidromasaje: Waves,
}

export function TelosList({ telos }: TelosListProps) {
  return (
    <div className="space-y-4">
      {telos.map((telo) => (
        <Link key={telo.id} href={`/telo/${telo.slug}`}>
          <Card className="transition-shadow hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex gap-4">
                {/* Image placeholder */}
                <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-lg">
                  {telo.imagen ? (
                    <img
                      src={telo.imagen || "/placeholder.svg"}
                      alt={telo.nombre}
                      className="object-cover w-full h-full rounded-lg"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-400">
                      <MapPin className="w-8 h-8" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{telo.nombre}</h3>
                      <p className="flex items-center mt-1 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-1" />
                        {telo.direccion}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{telo.rating}</span>
                      </div>
                      <p className="mt-1 text-lg font-bold text-purple-600">${telo.precio}</p>
                    </div>
                  </div>

                  {/* Services */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {telo.servicios.slice(0, 3).map((servicio) => {
                      const Icon = serviceIcons[servicio.toLowerCase()] || Wifi
                      return (
                        <Badge key={servicio} variant="secondary" className="flex items-center gap-1">
                          <Icon className="w-3 h-3" />
                          {servicio}
                        </Badge>
                      )
                    })}
                    {telo.servicios.length > 3 && <Badge variant="outline">+{telo.servicios.length - 3} más</Badge>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
