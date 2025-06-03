"use client"

import { useState, useEffect, useRef } from "react"
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
  // Usar un objeto para rastrear si ya se ha realizado la carga inicial para cada ciudad
  const hasFetchedForCity = useRef<{ [key: string]: boolean }>({})

  const ciudadSlug = params.ciudad
  const ciudadName = capitalizeCityName(ciudadSlug)

  useEffect(() => {
    document.title = `Telos en ${ciudadName} | Compará precios y servicios ${new Date().getFullYear()} | Motelo`
  }, [ciudadName])

  const fetchTelosFromDatabase = async (): Promise<Telo[]> => {
    try {
      console.log(`🔍 [${ciudadName} Page] Buscando telos en la base de datos...`)
      const response = await fetch(`/api/telos?ciudad=${encodeURIComponent(ciudadName)}`)
      if (response.ok) {
        const data = await response.json()
        console.log(`✅ [${ciudadName} Page] Encontrados ${data.length} telos en DB.`)
        return Array.isArray(data) ? data : []
      }
      console.log(`⚠️ [${ciudadName} Page] No se encontraron telos en DB.`)
      return []
    } catch (error) {
      console.error(`❌ [${ciudadName} Page] Error fetching from database:`, error)
      return []
    }
  }

  const searchTelosOnline = async (): Promise<Telo[]> => {
    try {
      setSearching(true)
      console.log(`🔍 [${ciudadName} Page] Iniciando búsqueda en tiempo real (n8n)...`)
      const response = await fetch("/api/n8n/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ciudad: ciudadName }),
      })

      if (response.ok) {
        const data = await response.json()
        console.log(`✅ [${ciudadName} Page] Recibidos ${data.telos?.length || 0} telos de n8n.`)
        return Array.isArray(data.telos) ? data.telos : []
      }
      const errorText = await response.text()
      console.error(`❌ [${ciudadName} Page] Error en n8n search API (${response.status}): ${errorText}`)
      return []
    } catch (error) {
      console.error(`❌ [${ciudadName} Page] Error searching online:`, error)
      return []
    } finally {
      setSearching(false)
    }
  }

  const fetchAndSetTelos = async () => {
    // CORREGIDO: Mover la verificación y el marcado del ref al inicio de la función
    if (hasFetchedForCity.current[ciudadName]) {
      console.log(
        `ℹ️ [${ciudadName} Page] fetchAndSetTelos ya se ejecutó para esta ciudad en esta instancia. Evitando re-fetch.`,
      )
      return
    }
    hasFetchedForCity.current[ciudadName] = true // Marcar que la carga inicial para esta ciudad ha comenzado

    setLoading(true)
    console.log(`🔄 [${ciudadName} Page] Iniciando proceso de carga de telos...`)

    // 1. Intentar cargar desde la base de datos
    const dbTelos = await fetchTelosFromDatabase()

    if (dbTelos.length > 0) {
      setTelos(dbTelos)
      console.log(`✨ [${ciudadName} Page] Mostrando ${dbTelos.length} telos de la base de datos.`)
    } else {
      // 2. Si no hay datos en DB, buscar automáticamente online
      console.log(`🚨 [${ciudadName} Page] No hay telos en DB. Iniciando búsqueda online...`)
      const onlineTelos = await searchTelosOnline()
      if (onlineTelos.length > 0) {
        setTelos(onlineTelos)
        console.log(`✨ [${ciudadName} Page] Mostrando ${onlineTelos.length} telos de la búsqueda online.`)
      } else {
        console.log(`🚫 [${ciudadName} Page] No se encontraron telos para ${ciudadName} ni en DB ni online.`)
        setTelos([])
      }
    }
    setLoading(false)
    console.log(`🏁 [${ciudadName} Page] Proceso de carga de telos finalizado.`)
  }

  const refreshSearch = async () => {
    console.log(`🔄 [${ciudadName} Page] Botón 'Actualizar' presionado. Forzando búsqueda online...`)
    // No usar hasFetchedForCity aquí, ya que es una acción explícita del usuario para refrescar/buscar
    const onlineTelos = await searchTelosOnline()
    if (onlineTelos.length > 0) {
      setTelos(onlineTelos)
    } else {
      setTelos([])
    }
  }

  useEffect(() => {
    // Este useEffect se ejecuta cuando el componente se monta o cuando ciudadName cambia.
    // La lógica de prevención de doble llamada está ahora dentro de fetchAndSetTelos.
    fetchAndSetTelos()
  }, [ciudadName]) // Dependencia de ciudadName para re-fetch si la ciudad cambia

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

      <div className="bg-white/95 backdrop-blur-sm border-b border-purple-100 fixed top-16 md:top-16 left-0 right-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-lg font-bold text-gray-900 flex-shrink-0">Telos en {ciudadName}</h1>

            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-xl border-purple-100 h-9"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 flex-shrink-0">
              <Button
                variant={showFilters ? "default" : "outline"}
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="rounded-full h-9"
              >
                <Filter className="w-4 h-4" />
              </Button>
              <div className="hidden md:flex items-center space-x-1">
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-full h-9"
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "map" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("map")}
                  className="rounded-full h-9"
                >
                  <Map className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6" style={{ paddingTop: "80px" }}>
        <div className="flex flex-col lg:flex-row gap-6">
          {showFilters && (
            <div className="hidden lg:block w-full lg:w-80 flex-shrink-0">
              <div className="sticky top-44">
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
