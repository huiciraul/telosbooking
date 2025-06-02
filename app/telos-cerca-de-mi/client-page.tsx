"use client"

import { useState, useEffect, Suspense } from "react"
import { MobileHeader } from "@/components/layout/mobile-header"
import { ResponsiveHeader } from "@/components/layout/responsive-header"
import { TeloCard } from "@/components/telos/telo-card"
import { TelosMapWrapper } from "@/components/telos-map-wrapper"
import { Button } from "@/components/ui/button"
import { Navigation, Loader2, AlertTriangle, List, MapIcon } from "lucide-react"
import type { Telo } from "@/lib/models"

// Helper para calcular distancia (simplificado, Haversine es más preciso)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371 // Radio de la Tierra en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c // Distancia en km
}

export default function TelosCercaDeMiClientPage() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [telos, setTelos] = useState<Telo[]>([])
  const [sortedTelos, setSortedTelos] = useState<Telo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"list" | "map">("list")

  useEffect(() => {
    // document.title is not needed here as metadata is handled by the server component
    // document.title = "Telos Cerca de Mí | Encuentra Albergues Transitorios Cercanos | Motelos"

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (err) => {
          console.error("Error obteniendo ubicación:", err)
          setError(
            "No se pudo obtener tu ubicación. Asegúrate de tener activados los servicios de localización y permisos para este sitio.",
          )
          setLoading(false)
        },
      )
    } else {
      setError("La geolocalización no es soportada por tu navegador.")
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    async function fetchAllTelos() {
      if (!userLocation) return

      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/telos?limit=200`)
        if (!response.ok) throw new Error("Error al cargar los telos.")

        const allTelosData = await response.json()
        const allTelos: Telo[] = Array.isArray(allTelosData) ? allTelosData : []

        if (allTelos.length === 0) {
          setTelos([])
          setSortedTelos([])
          setLoading(false)
          return
        }

        const telosWithDistance = allTelos
          .filter((telo) => telo.lat != null && telo.lng != null)
          .map((telo) => ({
            ...telo,
            distance: calculateDistance(userLocation.lat, userLocation.lng, telo.lat!, telo.lng!),
          }))
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 20)

        setTelos(allTelos)
        setSortedTelos(telosWithDistance as Telo[])
      } catch (err) {
        console.error(err)
        setError("Error al cargar la lista de telos.")
      } finally {
        setLoading(false)
      }
    }

    if (userLocation) {
      fetchAllTelos()
    }
  }, [userLocation])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="block md:hidden">
        <MobileHeader />
      </div>
      <div className="hidden md:block">
        <ResponsiveHeader />
      </div>

      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <Navigation className="w-12 h-12 mx-auto text-purple-600 mb-3" />
          <h1 className="text-3xl font-bold text-gray-900">Telos Cerca de Mí</h1>
          <p className="text-gray-600 mt-2">Encontrando albergues transitorios basados en tu ubicación actual.</p>
        </header>

        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
            <p className="text-gray-600">
              {userLocation ? "Buscando telos cercanos..." : "Obteniendo tu ubicación..."}
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md" role="alert">
            <div className="flex">
              <div className="py-1">
                <AlertTriangle className="h-6 w-6 text-red-500 mr-3" />
              </div>
              <div>
                <p className="font-bold">Error de Geolocalización</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && userLocation && (
          <>
            <div className="flex justify-end mb-4">
              <div className="flex items-center space-x-2">
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
                  <MapIcon className="w-4 h-4 mr-2" />
                  Mapa
                </Button>
              </div>
            </div>

            {viewMode === "list" ? (
              sortedTelos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedTelos.map((telo) => (
                    <TeloCard key={telo.id} telo={telo} />
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-10">No se encontraron telos cerca de tu ubicación actual.</p>
              )
            ) : (
              <div className="h-[500px] md:h-[600px] rounded-lg overflow-hidden shadow-md">
                <Suspense fallback={<div className="w-full h-full bg-gray-200 animate-pulse" />}>
                  <TelosMapWrapper telos={sortedTelos} center={[userLocation.lat, userLocation.lng]} zoom={13} />
                </Suspense>
              </div>
            )}
          </>
        )}
        {!loading &&
          !error &&
          !userLocation &&
          !error && ( // Show message if location is not available but no error yet
            <p className="text-center text-gray-500 py-10">
              Esperando permisos de ubicación para buscar telos cercanos.
            </p>
          )}
      </div>
    </div>
  )
}
