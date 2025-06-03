"use client"

import { useState, useEffect } from "react"
import { MobileHeader } from "@/components/layout/mobile-header"
import { ResponsiveHeader } from "@/components/layout/responsive-header"
import { TeloCard } from "@/components/telos/telo-card"
import { TelosFilters } from "@/components/telos-filters"
import { TelosMapWrapper } from "@/components/telos-map-wrapper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Map, List, Filter, Search, X, HelpCircle, RefreshCw } from "lucide-react"
import type { Telo } from "@/lib/models"
import { FaqSection } from "@/components/sections/faq-section"

interface PageProps {
  params: { ciudad: string }
}

// Función para capitalizar nombres de ciudades
function capitalizeCityName(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export default function CiudadPage({ params }: PageProps) {
  const [viewMode, setViewMode] = useState<"list" | "map">("list")
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [telos, setTelos] = useState<Telo[]>([])
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)

  const ciudadSlug = params.ciudad
  const ciudadName = capitalizeCityName(ciudadSlug)

  // Actualizar título del documento dinámicamente
  useEffect(() => {
    document.title = `Telos en ${ciudadName} | Compará precios y servicios ${new Date().getFullYear()} | Motelo`
  }, [ciudadName])

  const fetchTelosFromDatabase = async () => {
    try {
      console.log(`🔍 Buscando telos para ${ciudadName}...`)
      const response = await fetch(`/api/telos?ciudad=${encodeURIComponent(ciudadName)}`)
      if (response.ok) {
        const data = await response.json()
        return Array.isArray(data) ? data : []
      }
      return []
    } catch (error) {
      console.error("Error fetching from database:", error)
      return []
    }
  }

  const searchTelosOnline = async () => {
    try {
      setSearching(true)
      console.log(`🔍 Buscando telos en tiempo real para ${ciudadName}...`)
      const response = await fetch("/api/n8n/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ciudad: ciudadName }),
      })

      if (response.ok) {
        const data = await response.json()
        return Array.isArray(data.telos) ? data.telos : []
      }
      return []
    } catch (error) {
      console.error("Error searching online:", error)
      return []
    } finally {
      setSearching(false)
    }
  }

  const fetchTelos = async () => {
    setLoading(true)

    // Primero buscar en base de datos
    const dbTelos = await fetchTelosFromDatabase()

    if (dbTelos.length > 0) {
      setTelos(dbTelos)
    } else {
      // Si no hay datos en BD, buscar automáticamente online
      const onlineTelos = await searchTelosOnline()
      if (onlineTelos.length > 0) {
        setTelos(onlineTelos)
      } else {
        // Usar mock data como último recurso
        const { mockTelos } = await import("@/lib/models")
        const filteredMockTelos = Array.isArray(mockTelos)
          ? mockTelos.filter((t) => t.ciudad.toLowerCase().includes(ciudadName.toLowerCase()))
          : []
        setTelos(filteredMockTelos)
      }
    }
    setLoading(false)
  }

  const refreshSearch = async () => {
    const onlineTelos = await searchTelosOnline()
    if (onlineTelos.length > 0) {
      setTelos(onlineTelos)
    }
  }

  useEffect(() => {
    fetchTelos()
  }, [ciudadName])

  const filteredTelos = Array.isArray(telos)
    ? telos.filter(
        (telo) =>
          telo.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          telo.direccion?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : []

  const faqItems = [
    {
      question: `¿Cuánto cuesta un telo en ${ciudadName}?`,
      answer: `Los precios de los telos en ${ciudadName} varían según la categoría y los servicios. Te recomendamos contactar directamente para consultar tarifas actualizadas.`,
    },
    {
      question: `¿Qué servicios suelen tener los telos en ${ciudadName}?`,
      answer: `Muchos telos en ${ciudadName} ofrecen servicios como jacuzzi, cochera privada, WiFi, y atención las 24 horas. Algunos también cuentan con habitaciones temáticas y servicio de bar.`,
    },
    {
      question: `¿Es posible reservar un telo por WhatsApp en ${ciudadName}?`,
      answer: `Algunos telos en ${ciudadName} permiten consultas o reservas por WhatsApp. En la ficha de cada telo, si está disponible, encontrarás el número de contacto directo.`,
    },
    {
      question: `¿Hay telos con cochera privada en ${ciudadName}?`,
      answer: `Sí, varios telos en ${ciudadName} ofrecen cochera privada para mayor discreción y comodidad. Puedes usar nuestros filtros para encontrar aquellos que disponen de este servicio.`,
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
        <div className="block md:hidden">
          <MobileHeader />
        </div>
        <div className="hidden md:block">
          <ResponsiveHeader />
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="block md:hidden">
        <MobileHeader />
      </div>
      <div className="hidden md:block">
        <ResponsiveHeader />
      </div>

      <div className="bg-white border-b border-purple-100 sticky top-16 md:top-16 z-30">
        <div className="container mx-auto px-4 py-4">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-3">
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
                <span className="font-medium text-gray-700">{ciudadName}</span>
              </li>
            </ol>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Telos en {ciudadName}</h1>
              <p className="text-gray-600 mt-1">
                {`Encontrá los mejores telos en ${ciudadName}. Con cochera, jacuzzi, 24 horas, y más. ¡Compará y elegí!`}
              </p>
              <p className="text-sm text-gray-500 mt-1">{filteredTelos.length} albergues transitorios disponibles</p>
            </div>
            <div className="hidden lg:flex items-center space-x-2">
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-full"
              >
                <List className="w-4 h-4 mr-2" />
                Lista
              </Button>
              <Button
                variant={viewMode === "map" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("map")}
                className="rounded-full"
              >
                <Map className="w-4 h-4 mr-2" />
                Mapa
              </Button>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por nombre, zona o servicio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-xl border-purple-100"
              />
            </div>
            <div className="flex items-center justify-between">
              <Button
                variant={showFilters ? "default" : "outline"}
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="rounded-full"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtros {showFilters && <X className="w-4 h-4 ml-2" />}
              </Button>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refreshSearch}
                  disabled={searching}
                  className="rounded-full"
                >
                  {searching ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-2" />
                  )}
                  Actualizar
                </Button>
                <div className="flex lg:hidden items-center space-x-1">
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setViewMode("list")}
                    className="rounded-full w-8 h-8"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "map" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setViewMode("map")}
                    className="rounded-full w-8 h-8"
                  >
                    <Map className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {showFilters && (
            <div className="hidden lg:block w-full lg:w-80 flex-shrink-0">
              <div className="sticky top-48">
                <TelosFilters />
              </div>
            </div>
          )}
          {showFilters && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setShowFilters(false)}>
              <div className="absolute right-0 top-0 h-full w-80 bg-white p-4 overflow-y-auto shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">Filtros</h3>
                  <Button variant="ghost" size="icon" onClick={() => setShowFilters(false)} className="w-8 h-8">
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                <TelosFilters />
              </div>
            </div>
          )}

          <div className="flex-1 min-w-0">
            {viewMode === "list" ? (
              <div className="space-y-4">
                {filteredTelos.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredTelos.map((telo) => (
                      <TeloCard key={telo.id} telo={telo} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <HelpCircle className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No se encontraron telos en {ciudadName}
                    </h3>
                    <p className="text-gray-500 mb-6">Intenta ajustar tus filtros o buscar en tiempo real.</p>
                    <div className="space-y-3">
                      <Button onClick={refreshSearch} disabled={searching} className="rounded-full">
                        {searching ? (
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <RefreshCw className="w-4 h-4 mr-2" />
                        )}
                        Buscar en tiempo real
                      </Button>
                      <Button onClick={() => window.history.back()} variant="outline" className="rounded-full">
                        Volver
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-[calc(100vh-250px)] md:h-[calc(100vh-220px)] min-h-[400px] rounded-lg overflow-hidden shadow-md">
                <TelosMapWrapper telos={filteredTelos} />
              </div>
            )}
            {/* Sección de FAQ */}
            <div className="mt-12">
              <FaqSection title={`Preguntas Frecuentes sobre Telos en ${ciudadName}`} items={faqItems} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
