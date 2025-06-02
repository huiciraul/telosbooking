import { notFound } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Star, Phone, Clock, Wifi, Car, Waves } from "lucide-react"
import type { Telo } from "@/lib/models" // Importar la interfaz Telo

interface PageProps {
  params: { slug: string }
}

async function getTeloBySlug(slug: string) {
  console.log("Page: Fetching telo with slug:", slug)
  const baseUrl = process.env.VERCEL_URL ? `https://$\{process.env.VERCEL_URL\}` : "http://localhost:3000"
  console.log("Page: Base URL:", baseUrl)

  try {
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"
    console.log("Page: Fetching from URL:", `${baseUrl}/api/telo/${slug}`)

    const res = await fetch(`${baseUrl}/api/telo/${slug}`, {
      next: { revalidate: 3600 },
    })

    console.log("Page: API response status:", res.status, res.statusText)

    if (!res.ok) {
      console.error("Page: Failed to fetch telo, response not OK:", res.status, res.statusText)
      return null
    }
    const data: Telo = await res.json() // Asegurarse de que el tipo sea Telo
    console.log("Page: Raw data received from API:", data) // Log the raw data
    console.log("Page: Telo data received:", data ? data.nombre : "None") // Log the name if available
    return data
  } catch (error) {
    console.error("Page: Error fetching telo in getTeloBySlug:", error)
    return null
  }
}

const serviceIcons: Record<string, any> = {
  wifi: Wifi,
  estacionamiento: Car,
  cochera: Car,
  hidromasaje: Waves,
  jacuzzi: Waves,
}

export default async function TeloPage({ params }: PageProps) {
  const telo = await getTeloBySlug(params.slug)

  if (!telo) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-8 mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{telo.nombre}</h1>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="font-medium">{telo.rating}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>
                {telo.direccion}, {telo.ciudad}
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card>
              <CardContent className="p-0">
                <div className="h-64 bg-gray-200 rounded-t-lg">
                  {telo.imagen_url ? (
                    <img
                      src={telo.imagen_url || "/placeholder.svg?height=256&width=512&query=hotel exterior"}
                      alt={telo.nombre}
                      className="object-cover w-full h-full rounded-t-lg"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-400">
                      <MapPin className="w-16 h-16" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-semibold">Descripción</h2>
                <p className="text-gray-600">
                  {telo.descripcion ||
                    `${telo.nombre} es un albergue transitorio ubicado en ${telo.ciudad}. Ofrecemos servicios de calidad para garantizar tu comodidad y privacidad.`}
                </p>
              </CardContent>
            </Card>

            {/* Services */}
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-semibold">Servicios</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {telo.servicios.map((servicio: string) => {
                    const Icon = serviceIcons[servicio.toLowerCase()] || Wifi
                    return (
                      <div key={servicio} className="flex items-center gap-2">
                        <Icon className="w-5 h-5 text-purple-600" />
                        <span>{servicio}</span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <Card>
              <CardContent className="p-6">
                <div className="mb-4 text-center">
                  <div className="text-3xl font-bold text-purple-600">{telo.precio}</div>
                  <div className="text-sm text-gray-600">por turno</div>
                </div>

                <div className="space-y-4">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    <Phone className="w-4 h-4 mr-2" />
                    Llamar Ahora
                  </Button>

                  {telo.telefono && (
                    <div className="text-center">
                      <a href={`tel:${telo.telefono}`} className="text-lg font-semibold text-purple-600">
                        {telo.telefono}
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Hours */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-3 font-semibold flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Horarios
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Lunes - Domingo</span>
                    <span>24 horas</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-3 font-semibold flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Ubicación
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {telo.direccion}, {telo.ciudad}
                </p>
                <div className="h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500 text-sm">Mapa interactivo</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
