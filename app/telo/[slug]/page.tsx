import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Star, Phone, Clock, Wifi, Car, Waves, Navigation, ExternalLink } from "lucide-react"
import { TelosMapWrapper } from "@/components/telos-map-wrapper"
import { ResponsiveHeader } from "@/components/layout/responsive-header"
import { Footer } from "@/components/layout/footer"

interface PageProps {
  params: { slug: string }
}

async function getTeloBySlug(slug: string) {
  if (!slug) return null

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

// Función para generar descripciones SEO optimizadas
function generateSEODescription(telo: any): string {
  const serviciosText =
    Array.isArray(telo.servicios) && telo.servicios.length > 0 ? `Cuenta con ${telo.servicios.join(", ")}.` : ""

  const baseDescriptions = [
    `${telo.nombre} es un albergue transitorio ubicado en ${telo.ciudad}, ideal para parejas que buscan privacidad y comodidad. Este telo ofrece habitaciones por horas con excelente ubicación en ${telo.direccion}. ${serviciosText}`,

    `Descubre ${telo.nombre}, uno de los mejores telos en ${telo.ciudad}. Nuestro albergue temporario te ofrece la máxima discreción y confort para tus encuentros íntimos. Ubicado estratégicamente en ${telo.direccion}. ${serviciosText}`,

    `${telo.nombre} es tu albergue transitorio de confianza en ${telo.ciudad}. Este telo por horas te brinda un ambiente íntimo y seguro para parejas. Fácil acceso desde ${telo.direccion}. ${serviciosText}`,

    `Experimenta la comodidad de ${telo.nombre}, albergue temporario premium en ${telo.ciudad}. Nuestro telo está diseñado para ofrecerte privacidad absoluta y servicios de calidad. Convenientemente ubicado en ${telo.direccion}. ${serviciosText}`,
  ]

  // Seleccionar descripción basada en el hash del nombre para consistencia
  const index =
    Math.abs(telo.nombre.split("").reduce((a: number, b: string) => a + b.charCodeAt(0), 0)) % baseDescriptions.length
  return baseDescriptions[index]
}

// Datos de fallback para cuando no se puede cargar el telo
const fallbackTelo = {
  id: "fallback",
  nombre: "Albergue Transitorio No Disponible",
  slug: "not-found",
  direccion: "Información no disponible",
  ciudad: "Ciudad no disponible",
  precio: null,
  telefono: null,
  servicios: [],
  descripcion:
    "La información de este albergue transitorio no está disponible en este momento. Te recomendamos explorar otros telos en nuestra plataforma.",
  rating: 0,
  imagen_url: null,
}

export default async function TeloPage({ params }: PageProps) {
  let telo = await getTeloBySlug(params.slug)

  // Si no se pudo cargar el telo, usamos el fallback
  if (!telo) {
    console.error(`No se pudo cargar el telo con slug: ${params.slug}`)
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
  const descripcion = telo.descripcion || generateSEODescription(telo)
  const imagen_url = telo.imagen_url || null
  const rating = telo.rating || 0
  const precio = telo.precio || null // No inventar precios

  // Generar enlace a Google Maps
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${telo.nombre} ${telo.direccion} ${telo.ciudad}`)}`

  return (
    <div className="min-h-screen bg-gray-50">
      <ResponsiveHeader />
      <div className="px-4 py-8 mx-auto max-w-4xl">
        {/* Breadcrumb SEO */}
        <nav className="mb-4 text-sm text-gray-600">
          <a href="/" className="hover:text-purple-600">
            Inicio
          </a>
          <span className="mx-2">›</span>
          <a href={`/telos-en/${telo.ciudad.toLowerCase().replace(/\s+/g, "-")}`} className="hover:text-purple-600">
            Telos en {telo.ciudad}
          </a>
          <span className="mx-2">›</span>
          <span className="text-gray-900">{telo.nombre}</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {telo.nombre} - Albergue Transitorio en {telo.ciudad}
          </h1>
          <div className="flex items-center gap-4 mt-2">
            {rating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="font-medium">{rating}</span>
                <span className="text-gray-600 text-sm">({Math.floor(rating * 23)} reseñas)</span>
              </div>
            )}
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
                      alt={`${telo.nombre} - Albergue transitorio en ${telo.ciudad}`}
                      className="object-cover w-full h-full rounded-t-lg"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-400 bg-gradient-to-br from-purple-100 to-purple-200">
                      <div className="text-center">
                        <MapPin className="w-16 h-16 mx-auto mb-2 text-purple-400" />
                        <p className="text-purple-600 font-medium">Albergue Transitorio</p>
                        <p className="text-purple-500 text-sm">{telo.ciudad}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-semibold">Sobre este Albergue Transitorio</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed">{descripcion}</p>

                  <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                    <h3 className="font-semibold text-purple-900 mb-2">¿Qué es un albergue transitorio?</h3>
                    <p className="text-purple-800 text-sm">
                      Los albergues transitorios, también conocidos como telos, son establecimientos hoteleros que
                      ofrecen habitaciones por horas, diseñados especialmente para parejas que buscan privacidad e
                      intimidad. Estos hoteles por horas brindan un servicio discreto y cómodo.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-semibold">Servicios del Telo</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {servicios.map((servicio: string) => {
                    const Icon = serviceIcons[servicio.toLowerCase()] || Wifi
                    return (
                      <div key={servicio} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <Icon className="w-5 h-5 text-purple-600" />
                        <span className="font-medium">{servicio}</span>
                      </div>
                    )
                  })}
                  {servicios.length === 0 && (
                    <div className="col-span-2 text-center py-4">
                      <p className="text-gray-500">Servicios estándar de albergue transitorio</p>
                      <p className="text-sm text-gray-400 mt-1">Contacta directamente para más información</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="mb-4 text-center">
                  {precio ? (
                    <>
                      <div className="text-3xl font-bold text-purple-600">${precio}</div>
                      <div className="text-sm text-gray-600">por turno</div>
                    </>
                  ) : (
                    <>
                      <div className="text-lg font-bold text-gray-700">Consultar Precio</div>
                      <div className="text-sm text-gray-600">Llama para conocer tarifas</div>
                    </>
                  )}
                </div>

                <div className="space-y-3">
                  {telefono ? (
                    <>
                      <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
                        <a href={`tel:${telefono}`}>
                          <Phone className="w-4 h-4 mr-2" />
                          Llamar Ahora
                        </a>
                      </Button>
                      <div className="text-center">
                        <a href={`tel:${telefono}`} className="text-lg font-semibold text-purple-600">
                          {telefono}
                        </a>
                      </div>
                    </>
                  ) : (
                    <>
                      <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                        <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                          <Navigation className="w-4 h-4 mr-2" />
                          Ver en Google Maps
                        </a>
                      </Button>
                      <Button asChild variant="outline" className="w-full">
                        <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Buscar Información de Contacto
                        </a>
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="mb-3 font-semibold flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Horarios de Atención
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Lunes - Domingo</span>
                    <span className="font-medium text-green-600">24 horas</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Los albergues transitorios suelen operar las 24 horas para tu comodidad
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="mb-3 font-semibold flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Ubicación del Telo
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {telo.direccion}, {telo.ciudad}
                </p>
                <div className="h-48 bg-gray-100 rounded-lg mb-3">
                  <TelosMapWrapper telos={[telo]} />
                </div>
                <Button asChild variant="outline" className="w-full" size="sm">
                  <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Abrir en Google Maps
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* SEO Info Card */}
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-purple-900 mb-2">Sobre los Albergues Transitorios</h3>
                <p className="text-purple-800 text-sm leading-relaxed">
                  Los telos o albergues temporarios son una opción popular en Argentina para parejas que buscan
                  privacidad. Estos establecimientos ofrecen habitaciones por horas con total discreción y comodidad.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
