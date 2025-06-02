import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  Star,
  Phone,
  Clock,
  Wifi,
  Car,
  Waves,
  Navigation,
  ExternalLink,
  ImageIcon,
  ShieldCheck,
  DollarSign,
} from "lucide-react"
import { TelosMapWrapper } from "@/components/telos-map-wrapper"
import { ResponsiveHeader } from "@/components/layout/responsive-header"
import { Footer } from "@/components/layout/footer"
import type { Telo } from "@/lib/models" // Asegúrate que Telo esté bien definido
import { Suspense } from "react"
import type { Metadata, ResolvingMetadata } from "next" // Para generateMetadata

interface PageProps {
  params: { slug: string }
}

async function getTeloBySlug(slug: string): Promise<Telo | null> {
  if (!slug) return null

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")

  try {
    console.log(`Fetching telo with slug: ${slug} from ${baseUrl}/api/telo/${slug}`)
    const res = await fetch(`${baseUrl}/api/telo/${slug}`, {
      next: { revalidate: 3600 }, // Revalidar cada hora
    })

    if (!res.ok) {
      console.error(`Error fetching telo: ${res.status} ${res.statusText}`)
      return null
    }
    const data = await res.json()
    return data as Telo
  } catch (error) {
    console.error("Error fetching telo:", error)
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
  frigobar: Waves, // Icono aproximado
  // Añade más si es necesario
}

function generateSEODescription(telo: Telo): string {
  const serviciosText =
    Array.isArray(telo.servicios) && telo.servicios.length > 0
      ? `Disfruta de servicios como ${telo.servicios.slice(0, 3).join(", ")}.`
      : "Consulta por los servicios disponibles."
  return `Descubre ${telo.nombre} en ${telo.ciudad}, un albergue transitorio ideal para parejas. ${serviciosText} Ubicado en ${telo.direccion}. Encuentra privacidad y confort. Telos en ${telo.ciudad}.`
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
  fuente: null,
  fecha_scraping: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

// generateMetadata para SEO dinámico
export async function generateMetadata({ params }: PageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const slug = params.slug
  const telo = (await getTeloBySlug(slug)) || fallbackTelo
  const ciudad = telo.ciudad || "Argentina" // Fallback para ciudad

  const previousImages = (await parent).openGraph?.images || []

  const title = `${telo.nombre} en ${ciudad} - Precios y Servicios | Motelos`
  const description = telo.descripcion
    ? telo.descripcion.substring(0, 160)
    : `Encuentra detalles de ${telo.nombre}, albergue transitorio en ${ciudad}. Servicios, precios y ubicación. Ideal para parejas. Telos en ${ciudad}.`
  const canonicalUrl = `https://motelos.vercel.app/telo/${telo.slug}` // Asegúrate que esta sea tu URL de producción

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
      type: "article", // O 'product' si se ajusta más
      images: telo.imagen_url
        ? [{ url: telo.imagen_url, width: 800, height: 600, alt: telo.nombre }, ...previousImages]
        : [...previousImages],
      // article: { // Si es 'article'
      //   publishedTime: telo.created_at?.toISOString(),
      //   modifiedTime: telo.updated_at?.toISOString(),
      //   authors: ['Motelos'],
      // },
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
    console.warn(`Telo con slug "${params.slug}" no encontrado, usando fallback.`)
    telo = fallbackTelo
  }

  const servicios = Array.isArray(telo.servicios) ? telo.servicios : []
  const telefono = telo.telefono || null
  const descripcion = telo.descripcion || generateSEODescription(telo)
  const imagen_url = telo.imagen_url || null
  const rating = telo.rating || 0
  const precio = telo.precio || null
  const ciudad = telo.ciudad || "Ciudad Desconocida"

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${telo.nombre} ${telo.direccion} ${telo.ciudad}`)}`

  // Schema.org JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness", // O Hotel, LodgingBusiness
    name: telo.nombre,
    description: descripcion.substring(0, 250),
    address: {
      "@type": "PostalAddress",
      streetAddress: telo.direccion,
      addressLocality: telo.ciudad,
      addressCountry: "AR", // Argentina
    },
    image: imagen_url,
    telephone: telefono,
    priceRange: precio ? `$${precio}` : "Consultar", // Formato de ejemplo
    ...(telo.lat &&
      telo.lng && {
        geo: {
          "@type": "GeoCoordinates",
          latitude: telo.lat,
          longitude: telo.lng,
        },
      }),
    ...(rating > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: rating.toString(),
        reviewCount: (Math.floor(rating * 15) + 5).toString(), // Estimación de reviews
      },
    }),
    // url: `https://motelos.vercel.app/telo/${telo.slug}`, // Asegúrate que esta sea tu URL de producción
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ResponsiveHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-gray-500">
          <ol className="list-none p-0 inline-flex">
            <li className="flex items-center">
              <a href="/" className="hover:text-purple-600">
                Inicio
              </a>
              <svg className="fill-current w-3 h-3 mx-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569 9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
              </svg>
            </li>
            <li className="flex items-center">
              <a href={`/telos-en/${ciudad.toLowerCase().replace(/\s+/g, "-")}`} className="hover:text-purple-600">
                Telos en {ciudad}
              </a>
              <svg className="fill-current w-3 h-3 mx-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569 9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
              </svg>
            </li>
            <li className="flex items-center">
              <span className="font-medium text-gray-700">{telo.nombre}</span>
            </li>
          </ol>
        </nav>

        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">{telo.nombre}</h1>
          <p className="text-lg text-gray-600">
            Albergue Transitorio en {telo.ciudad} - {telo.direccion.split(",")[0]}
          </p>
          <div className="flex items-center gap-4 mt-2">
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
              {/* Podrías añadir una galería de fotos aquí si tienes múltiples imágenes */}
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

            {/* Placeholder para Opiniones */}
            <Card>
              <CardHeader>
                <CardTitle>Opiniones de Usuarios</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">
                  Aún no hay opiniones para este telo. ¡Sé el primero en compartir tu experiencia!
                </p>
                {/* Aquí podrías integrar un sistema de comentarios o mostrar un promedio si lo tuvieras */}
              </CardContent>
            </Card>
          </div>

          <div className="lg:sticky lg:top-20 space-y-6 self-start">
            {" "}
            {/* Sticky sidebar */}
            <Card className="shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-center">Información y Contacto</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                {precio ? (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Precio por turno desde</p>
                    <p className="text-4xl font-bold text-purple-600">${precio}</p>
                  </div>
                ) : (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-lg font-semibold text-yellow-700">Consultar Precio</p>
                    <p className="text-sm text-yellow-600">Llama para conocer tarifas y disponibilidad.</p>
                  </div>
                )}

                <div className="space-y-3">
                  {telefono ? (
                    <>
                      <Button asChild className="w-full gradient-primary text-white">
                        <a href={`tel:${telefono}`}>
                          <Phone className="w-5 h-5 mr-2" /> Llamar Ahora
                        </a>
                      </Button>
                      <p className="text-lg font-semibold text-purple-600">{telefono}</p>
                    </>
                  ) : (
                    <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                        <Navigation className="w-5 h-5 mr-2" /> Ver en Google Maps
                      </a>
                    </Button>
                  )}
                  <Button asChild variant="outline" className="w-full">
                    <a
                      href={`https://wa.me/?text=Hola, quisiera consultar sobre ${telo.nombre} en ${telo.ciudad}. Link: ${`https://motelos.vercel.app/telo/${telo.slug}`}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                      >
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8.3 8.5z"></path>
                      </svg>
                      Consultar por WhatsApp
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-purple-600" />
                  Horarios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm">
                  <span>Lunes - Domingo:</span>
                  <span className="font-medium text-green-600">Abierto 24 horas</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  La mayoría de los albergues transitorios operan continuamente.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-purple-600" />
                  Ubicación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-3">
                  {telo.direccion}, {telo.ciudad}
                </p>
                <div className="h-48 bg-gray-100 rounded-lg mb-3 overflow-hidden">
                  <Suspense fallback={<div className="w-full h-full bg-gray-200 animate-pulse" />}>
                    <TelosMapWrapper telo={telo} />
                  </Suspense>
                </div>
                <Button asChild variant="outline" className="w-full" size="sm">
                  <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" /> Abrir en Google Maps
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
