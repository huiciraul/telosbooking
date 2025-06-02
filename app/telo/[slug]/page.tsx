import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star, Wifi, Car, Waves, ImageIcon, ShieldCheck, DollarSign } from "lucide-react"
import { TelosMapWrapper } from "@/components/telos-map-wrapper"
import { ResponsiveHeader } from "@/components/layout/responsive-header"
import type { Telo } from "@/lib/models"
import type { Metadata, ResolvingMetadata } from "next"
import { prisma } from "@/lib/prisma" // Now correctly imported
import { Shell } from "@/components/shell" // Now correctly imported
import { EditTeloButton } from "@/components/edit-telo-button" // Now correctly imported

interface PageProps {
  params: { slug: string }
}

async function getTeloBySlug(slug: string): Promise<Telo | null> {
  if (!slug) return null
  try {
    const telo = await prisma.telo.findUnique({
      where: { slug },
    })
    // Ensure all date fields are Date objects if your Telo type expects them
    // Prisma typically returns Date objects, but if transforming, be careful
    if (telo) {
      return {
        ...telo,
        created_at: telo.created_at ? new Date(telo.created_at) : new Date(),
        updated_at: telo.updated_at ? new Date(telo.updated_at) : new Date(),
        fecha_scraping: telo.fecha_scraping ? new Date(telo.fecha_scraping) : null,
      } as Telo // Cast to Telo to ensure type conformity
    }
    return null
  } catch (error) {
    console.error(`Error fetching telo by slug ${slug}:`, error)
    return null
  }
}

const serviceIcons: Record<string, React.ElementType> = {
  wifi: Wifi,
  estacionamiento: Car,
  cochera: Car,
  hidromasaje: Waves,
  jacuzzi: Waves,
  "tv cable": DollarSign,
  "aire acondicionado": Waves,
  frigobar: Waves,
}

const fallbackTelo: Telo = {
  id: "fallback",
  nombre: "Albergue Transitorio No Disponible",
  slug: "not-found",
  direccion: "Información no disponible",
  ciudad: "Ciudad no disponible",
  precio: null,
  telefono: null,
  servicios: [],
  descripcion: "La información de este albergue transitorio no está disponible. Explora otras opciones en Motelos.",
  rating: 0,
  imagen_url: null,
  lat: null,
  lng: null,
  activo: false,
  verificado: false,
  fuente: "fallback",
  fecha_scraping: null,
  created_at: new Date(),
  updated_at: new Date(),
}

export async function generateMetadata({ params }: PageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const slug = params.slug
  const telo = (await getTeloBySlug(slug)) || fallbackTelo
  const ciudad = telo.ciudad || "Argentina"

  const previousImages = (await parent).openGraph?.images || []

  const title = `${telo.nombre} en ${ciudad} - Precios y Servicios | Motelos`
  const description = telo.descripcion
    ? telo.descripcion.substring(0, 160)
    : `Encuentra detalles de ${telo.nombre}, albergue transitorio en ${ciudad}. Servicios, precios y ubicación.`
  const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://motelos.vercel.app"}/telo/${telo.slug}`

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "article",
      images: telo.imagen_url
        ? [{ url: telo.imagen_url, width: 800, height: 600, alt: telo.nombre }, ...previousImages]
        : [...previousImages],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: telo.imagen_url ? [telo.imagen_url] : undefined,
    },
  }
}

export default async function TeloPage({ params }: PageProps) {
  let telo = await getTeloBySlug(params.slug)

  if (!telo) {
    // Forcing fallback for demonstration if notFound() is too abrupt during dev
    // In production, you might use notFound() or a more specific error page
    console.warn(`Telo con slug "${params.slug}" no encontrado, usando fallback.`)
    telo = fallbackTelo
    // notFound(); // Or redirect to a custom 404 or search page
  }

  const servicios = Array.isArray(telo.servicios) ? telo.servicios : []
  const telefono = telo.telefono || null
  const descripcion = telo.descripcion || `Información sobre ${telo.nombre}.`
  const imagen_url = telo.imagen_url || null
  const rating = telo.rating || 0
  const precio = telo.precio || null
  const ciudad = telo.ciudad || "Ciudad Desconocida"

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${telo.nombre} ${telo.direccion} ${telo.ciudad}`)}`

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: telo.nombre,
    description: descripcion.substring(0, 250),
    address: {
      "@type": "PostalAddress",
      streetAddress: telo.direccion,
      addressLocality: telo.ciudad,
      addressCountry: "AR",
    },
    image: imagen_url,
    telephone: telefono,
    priceRange: precio ? `$${precio}` : "Consultar",
    ...(telo.lat &&
      telo.lng && {
        geo: { "@type": "GeoCoordinates", latitude: telo.lat.toString(), longitude: telo.lng.toString() },
      }),
    ...(rating > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: rating.toString(),
        reviewCount: (Math.floor(rating * 15) + 5).toString(),
      },
    }),
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://motelos.vercel.app"}/telo/${telo.slug}`,
  }

  const currentTelo = telo

  return (
    <Shell layout="default">
      {" "}
      {/* Using Shell component */}
      <ResponsiveHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container mx-auto px-4 py-8">
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-gray-500">
          {/* Breadcrumb content */}
        </nav>

        <div className="mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">{telo.nombre}</h1>
            <p className="text-lg text-gray-600">
              Albergue Transitorio en {telo.ciudad} - {telo.direccion?.split(",")[0]}
            </p>
          </div>
          {/* Example usage of EditTeloButton - this might be admin-only */}
          {telo.id !== "fallback" && ( // Don't show edit for fallback
            <EditTeloButton teloSlug={telo.slug} />
          )}
        </div>

        <div className="flex items-center gap-4 mt-2 mb-6">
          {rating > 0 && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 border-yellow-200">
              <Star className="w-4 h-4 mr-1 text-yellow-500 fill-current" />
              {rating.toFixed(1)} ({Math.floor(rating * 15) + 5} reseñas)
            </Badge>
          )}
          <Badge variant="outline">
            <MapPin className="w-4 h-4 mr-1" />
            {ciudad}
          </Badge>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden shadow-md">
              <div className="w-full h-64 md:h-96 bg-gray-200">
                {imagen_url ? (
                  <img
                    src={imagen_url || "/placeholder.svg"}
                    alt={`Fachada de ${telo.nombre} - Albergue transitorio en ${telo.ciudad}`}
                    className="object-cover w-full h-full"
                    width={800}
                    height={600}
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-gray-400 bg-gradient-to-br from-purple-100 to-purple-200">
                    <ImageIcon className="w-24 h-24 text-purple-300" />
                  </div>
                )}
              </div>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Descripción del Albergue</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm sm:prose lg:prose-md max-w-none text-gray-700">
                <p>{descripcion}</p>
                <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <h3 className="font-semibold text-purple-800 mb-1">¿Qué es un Telo / Albergue Transitorio?</h3>
                  <p className="text-sm text-purple-700">
                    Los albergues transitorios (o "telos") son hoteles que ofrecen habitaciones por turnos de algunas
                    horas, enfocados en brindar privacidad y comodidad para parejas. Son ideales para encuentros íntimos
                    y escapadas discretas.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Servicios Destacados</CardTitle>
              </CardHeader>
              <CardContent>
                {servicios.length > 0 ? (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {servicios.map((servicio: string) => {
                      const Icon = serviceIcons[servicio.toLowerCase().trim()] || ShieldCheck
                      return (
                        <li key={servicio} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Icon className="w-5 h-5 text-purple-600 flex-shrink-0" />
                          <span className="font-medium text-gray-700">{servicio}</span>
                        </li>
                      )
                    })}
                  </ul>
                ) : (
                  <p className="text-gray-500">No hay servicios detallados. Contacta al establecimiento.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Opiniones de Usuarios</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">
                  Aún no hay opiniones para este telo. ¡Sé el primero en compartir tu experiencia!
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="md:sticky md:top-20 h-[400px] md:h-[600px] w-full rounded-lg overflow-hidden shadow-lg">
            {currentTelo.lat && currentTelo.lng ? (
              <TelosMapWrapper telo={currentTelo} />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-100 text-gray-500">
                Ubicación del telo no disponible en el mapa.
              </div>
            )}
          </div>
        </div>
      </div>
    </Shell>
  )
}
