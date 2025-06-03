import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Star, Wifi, Car, Waves, ImageIcon, ShieldCheck, DollarSign, Phone, Clock } from "lucide-react"
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
  if (!slug) {
    console.log("❌ No slug provided")
    return null
  }

  console.log(`🔍 Buscando telo con slug: ${slug}`)

  // Primero buscar en mock data para tener un fallback rápido
  const mockTelo = mockTelos.find((t) => t.slug === slug)

  try {
    // Intentar obtener de la base de datos
    const result = await executeQuery<any[]>(`SELECT * FROM telos WHERE slug = $1 AND activo = true LIMIT 1`, [slug])

    if (result && result.length > 0) {
      const telo = result[0]
      console.log(`✅ Telo encontrado en BD: ${telo.nombre}`)
      return {
        ...telo,
        servicios: Array.isArray(telo.servicios) ? telo.servicios : [],
        created_at: telo.created_at ? new Date(telo.created_at).toISOString() : new Date().toISOString(),
        updated_at: telo.updated_at ? new Date(telo.updated_at).toISOString() : new Date().toISOString(),
        fecha_scraping: telo.fecha_scraping ? new Date(telo.fecha_scraping).toISOString() : null,
      } as Telo
    }
  } catch (error) {
    console.error(`❌ Error fetching telo by slug ${slug}:`, error)
  }

  // Si no se encuentra en BD o hay error, usar mock data
  if (mockTelo) {
    console.log(`✅ Usando mock data: ${mockTelo.nombre}`)
    return mockTelo
  }

  // Si el slug no existe en mock data, crear un telo genérico
  console.log(`⚠️ Slug no encontrado, creando telo genérico para: ${slug}`)
  return {
    id: "generic-" + slug,
    nombre: slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    slug: slug,
    direccion: "Dirección no disponible",
    ciudad: "Ciudad no especificada",
    precio: null,
    telefono: null,
    servicios: ["WiFi", "Estacionamiento"],
    descripcion: `Información sobre ${slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(
        " ",
      )}. Este es un albergue transitorio que ofrece servicios de calidad para garantizar tu comodidad y privacidad.`,
    rating: 4.0,
    imagen_url: null,
    lat: null,
    lng: null,
    activo: true,
    verificado: false,
    fuente: "generated",
    fecha_scraping: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  } as Telo
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

  try {
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
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: "Albergue Transitorio | Motelos",
      description: "Encuentra el mejor albergue transitorio en Motelos.",
    }
  }
}

export default async function TeloPage({ params }: PageProps) {
  let telo: Telo | null = null

  try {
    telo = await getTeloBySlug(params.slug)
  } catch (error) {
    console.error("Error in TeloPage:", error)
  }

  if (!telo) {
    notFound()
  }

  const servicios = Array.isArray(telo.servicios) ? telo.servicios : []
  const telefono = telo.telefono || null
  const descripcion = telo.descripcion || `Información sobre ${telo.nombre}.`
  const imagen_url = telo.imagen_url || null
  const rating =
    typeof telo.rating === "number" ? telo.rating : telo.rating ? Number.parseFloat(String(telo.rating)) : 0
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
    ...(rating > 0 &&
      typeof rating === "number" && {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: rating.toFixed(1),
          reviewCount: (Math.floor(rating * 15) + 5).toString(),
        },
      }),
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://motelos.vercel.app"}/telo/${telo.slug}`,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ResponsiveHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="px-4 py-8 mx-auto max-w-4xl">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-gray-500">
          <ol className="list-none p-0 inline-flex">
            <li className="flex items-center">
              <a href="/" className="hover:text-purple-600">
                Inicio
              </a>
              <span className="mx-2">/</span>
            </li>
            <li className="flex items-center">
              <a href={`/telos-en/${ciudad.toLowerCase().replace(/\s+/g, "-")}`} className="hover:text-purple-600">
                {ciudad}
              </a>
              <span className="mx-2">/</span>
            </li>
            <li>
              <span className="font-medium text-gray-700">{telo.nombre}</span>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{telo.nombre}</h1>
          <div className="flex items-center gap-4 mt-2">
            {rating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="font-medium">{rating > 0 ? rating.toFixed(1) : "0.0"}</span>
              </div>
            )}
            <div className="flex items-center gap-1 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>
                {telo.direccion}, {telo.ciudad}
              </span>
            </div>
            {telo.verificado && (
              <Badge variant="default" className="bg-green-100 text-green-700 border-green-200">
                <ShieldCheck className="w-4 h-4 mr-1" />
                Verificado
              </Badge>
            )}
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
                    <div className="flex items-center justify-center w-full h-full text-gray-400 bg-gradient-to-br from-purple-100 to-purple-200">
                      <ImageIcon className="w-16 h-16 text-purple-300" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-semibold">Descripción</h2>
                <p className="text-gray-600">{descripcion}</p>
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
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-semibold">Servicios</h2>
                {servicios.length > 0 ? (
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
                  </div>
                ) : (
                  <p className="text-gray-500">No hay servicios detallados. Contacta al establecimiento.</p>
                )}
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
                    <div className="text-lg text-gray-600">Consultar precio</div>
                  )}
                </div>

                <div className="space-y-4">
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
                    <div className="text-center text-gray-500">Teléfono no disponible</div>
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
                <Button asChild variant="outline" className="w-full">
                  <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                    <MapPin className="w-4 h-4 mr-2" />
                    Ver en Google Maps
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
