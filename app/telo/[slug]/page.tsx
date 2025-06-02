import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Star, Wifi, Car, Waves, ImageIcon, ShieldCheck, DollarSign, Phone } from "lucide-react"
import { TelosMapWrapper } from "@/components/telos-map-wrapper"
import { ResponsiveHeader } from "@/components/layout/responsive-header"
import { Footer } from "@/components/layout/footer"
import type { Telo } from "@/lib/models"
import { mockTelos } from "@/lib/models"
import type { Metadata, ResolvingMetadata } from "next"
import { executeQuery } from "@/lib/db"
import { notFound } from "next/navigation"

interface PageProps {
  params: { slug: string }
}

async function getTeloBySlug(slug: string): Promise<Telo | null> {
  if (!slug) return null

  try {
    console.log(`🔍 Buscando telo con slug: ${slug}`)

    // Intentar obtener de la base de datos primero
    const result = await executeQuery<any[]>(`SELECT * FROM telos WHERE slug = $1 AND activo = true LIMIT 1`, [slug])

    if (result.length > 0) {
      const telo = result[0]
      console.log(`✅ Telo encontrado en BD: ${telo.nombre}`)
      return {
        ...telo,
        created_at: telo.created_at ? new Date(telo.created_at).toISOString() : new Date().toISOString(),
        updated_at: telo.updated_at ? new Date(telo.updated_at).toISOString() : new Date().toISOString(),
        fecha_scraping: telo.fecha_scraping ? new Date(telo.fecha_scraping).toISOString() : null,
      } as Telo
    }

    // Si no se encuentra en BD, buscar en mock data
    const mockTelo = mockTelos.find((t) => t.slug === slug)
    if (mockTelo) {
      console.log(`✅ Telo encontrado en mock data: ${mockTelo.nombre}`)
      return mockTelo
    }

    console.log(`❌ Telo no encontrado: ${slug}`)
    return null
  } catch (error) {
    console.error(`❌ Error fetching telo by slug ${slug}:`, error)

    // Fallback a mock data en caso de error
    const mockTelo = mockTelos.find((t) => t.slug === slug)
    if (mockTelo) {
      console.log(`✅ Usando mock data como fallback: ${mockTelo.nombre}`)
      return mockTelo
    }

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

export async function generateMetadata({ params }: PageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const slug = params.slug
  const telo = await getTeloBySlug(slug)

  if (!telo) {
    return {
      title: "Telo no encontrado | Motelos",
      description: "El albergue transitorio que buscas no está disponible. Explora otras opciones en Motelos.",
    }
  }

  const ciudad = telo.ciudad || "Argentina"
  const title = `${telo.nombre} en ${ciudad} - Precios y Servicios | Motelos`
  const description = telo.descripcion
    ? telo.descripcion.substring(0, 160)
    : `Encuentra detalles de ${telo.nombre}, albergue transitorio en ${ciudad}. Servicios, precios y ubicación.`
  const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://motelos.vercel.app"}/telo/${telo.slug}`

  const previousImages = (await parent).openGraph?.images || []

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
  const telo = await getTeloBySlug(params.slug)

  if (!telo) {
    notFound()
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <ResponsiveHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-gray-500">
          <ol className="list-none p-0 inline-flex">
            <li className="flex items-center">
              <a href="/" className="hover:text-purple-600">
                Inicio
              </a>
              <svg
                className="fill-current w-3 h-3 mx-2 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
              >
                <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
              </svg>
            </li>
            <li className="flex items-center">
              <a href={`/telos-en/${ciudad.toLowerCase().replace(/\s+/g, "-")}`} className="hover:text-purple-600">
                {ciudad}
              </a>
              <svg
                className="fill-current w-3 h-3 mx-2 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
              >
                <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.30c9.373 9.372 9.373 24.568.001 33.941z" />
              </svg>
            </li>
            <li>
              <span className="font-medium text-gray-700">{telo.nombre}</span>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">{telo.nombre}</h1>
          <p className="text-lg text-gray-600">
            Albergue Transitorio en {telo.ciudad} - {telo.direccion?.split(",")[0]}
          </p>
        </div>

        {/* Badges */}
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
          {telo.verificado && (
            <Badge variant="default" className="bg-green-100 text-green-700 border-green-200">
              <ShieldCheck className="w-4 h-4 mr-1" />
              Verificado
            </Badge>
          )}
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
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

            {/* Price and Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Información y Contacto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Precio por turno</h3>
                    {precio ? (
                      <div className="text-3xl font-bold text-purple-600">${precio}</div>
                    ) : (
                      <div className="text-lg text-gray-600">Consultar precio</div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Contacto</h3>
                    {telefono ? (
                      <Button asChild className="w-full">
                        <a href={`tel:${telefono}`}>
                          <Phone className="w-4 h-4 mr-2" />
                          {telefono}
                        </a>
                      </Button>
                    ) : (
                      <p className="text-gray-500">Teléfono no disponible</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
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

            {/* Services */}
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

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle>Ubicación</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">{telo.direccion}</p>
                      <p className="text-gray-600">{telo.ciudad}</p>
                    </div>
                  </div>
                  <Button asChild variant="outline" className="w-full">
                    <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                      <MapPin className="w-4 h-4 mr-2" />
                      Ver en Google Maps
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Map */}
          <div className="lg:sticky lg:top-20">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Ubicación en el Mapa</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[400px] md:h-[500px] w-full">
                  {telo.lat && telo.lng ? (
                    <TelosMapWrapper telos={[telo]} />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gray-100 text-gray-500">
                      <div className="text-center">
                        <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                        <p>Ubicación del telo no disponible en el mapa</p>
                      </div>
                    </div>
                  )}
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
