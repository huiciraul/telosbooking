import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Star, Phone, Clock, Wifi, Car, Waves } from "lucide-react"
import { TelosMapWrapper } from "@/components/telos-map-wrapper"
import { ResponsiveHeader } from "@/components/layout/responsive-header"
import { Footer } from "@/components/layout/footer"

interface PageProps {
  params: { slug: string }
}

async function getTeloBySlug(slug: string) {
  if (!slug) return null

  // Usa NEXT_PUBLIC_SITE_URL si está definida, si no VERCEL_URL, si no localhost
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")

  try {
    console.log(`Fetching telo with slug: ${slug} from ${baseUrl}/api/telo/${slug}`)
    const res = await fetch(`${baseUrl}/api/telo/${slug}`, {
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      console.error(`Error fetching telo: ${res.status} ${res.statusText}`)
      return null
    }

    const data = await res.json()
    return data
  } catch (error) {
    console.error("Error fetching telo:", error)
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

// Datos de fallback para cuando no se puede cargar el telo
const fallbackTelo = {
  id: "fallback",
  nombre: "Telo no encontrado",
  slug: "not-found",
  direccion: "Dirección no disponible",
  ciudad: "Ciudad no disponible",
  precio: 0,
  telefono: null,
  servicios: [],
  descripcion: "La información de este telo no está disponible en este momento.",
  rating: 0,
  imagen_url: null,
}

export default async function TeloPage({ params }: PageProps) {
  let telo = await getTeloBySlug(params.slug)

  // Si no se pudo cargar el telo, usamos el fallback
  if (!telo) {
    console.error(`No se pudo cargar el telo con slug: ${params.slug}`)
    // Intentar cargar desde datos mock
    try {
      const { mockTelos } = await import("@/lib/prisma")
      telo = mockTelos.find((t) => t.slug === params.slug)

      if (!telo) {
        console.log("Telo no encontrado en datos mock, usando fallback")
        telo = fallbackTelo
      } else {
        console.log("Usando datos mock para el telo")
      }
    } catch (error) {
      console.error("Error cargando datos mock:", error)
      telo = fallbackTelo
    }
  }

  // Asegurar que todas las propiedades necesarias existan
  const servicios = Array.isArray(telo.servicios) ? telo.servicios : []
  const telefono = telo.telefono || null
  const descripcion =
    telo.descripcion ||
    `${telo.nombre} es un albergue transitorio ubicado en ${telo.ciudad}. Ofrecemos servicios de calidad para garantizar tu comodidad y privacidad.`
  const imagen_url = telo.imagen_url || null
  const rating = telo.rating || 0
  const precio = telo.precio || 0

  return (
    <div className="min-h-screen bg-gray-50">
      <ResponsiveHeader />
      <div className="px-4 py-8 mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{telo.nombre}</h1>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="font-medium">{rating}</span>
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
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-0">
                <div className="h-64 bg-gray-200 rounded-t-lg">
                  {imagen_url ? (
                    <img
                      src={imagen_url || "/placeholder.svg"}
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

            <Card>
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-semibold">Descripción</h2>
                <p className="text-gray-600">{descripcion}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-semibold">Servicios</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {servicios.map((servicio: string) => {
                    const Icon = serviceIcons[servicio.toLowerCase()] || Wifi
                    return (
                      <div key={servicio} className="flex items-center gap-2">
                        <Icon className="w-5 h-5 text-purple-600" />
                        <span>{servicio}</span>
                      </div>
                    )
                  })}
                  {servicios.length === 0 && (
                    <p className="text-gray-500 col-span-2">No hay información de servicios disponible.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="mb-4 text-center">
                  <div className="text-3xl font-bold text-purple-600">${precio}</div>
                  <div className="text-sm text-gray-600">por turno</div>
                </div>

                <div className="space-y-4">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    <Phone className="w-4 h-4 mr-2" />
                    Llamar Ahora
                  </Button>

                  {telefono && (
                    <div className="text-center">
                      <a href={`tel:${telefono}`} className="text-lg font-semibold text-purple-600">
                        {telefono}
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

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

            <Card>
              <CardContent className="p-6">
                <h3 className="mb-3 font-semibold flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Ubicación
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {telo.direccion}, {telo.ciudad}
                </p>
                <div className="h-48 bg-gray-100 rounded-lg">
                  <TelosMapWrapper telos={[telo]} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
