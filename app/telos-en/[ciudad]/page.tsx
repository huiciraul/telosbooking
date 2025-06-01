"use client"

import { useState, useEffect } from "react"
import { MobileHeader } from "@/components/layout/mobile-header"
import { TeloCard } from "@/components/telos/telo-card"
import { TelosFilters } from "@/components/telos-filters"
import { TelosMapWrapper } from "@/components/telos-map-wrapper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Map, List, Filter, Search } from "lucide-react"
import type { Telo } from "@/lib/models"

interface PageProps {
  params: { ciudad: string }
}

export default function CiudadPage({ params }: PageProps) {
  const [viewMode, setViewMode] = useState<"list" | "map">("list")
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [telos, setTelos] = useState<Telo[]>([])
  const [loading, setLoading] = useState(true)

  const ciudadName = params.ciudad.replace(/-/g, " ")

  useEffect(() => {
    async function fetchTelos() {
      try {
        const response = await fetch(`/api/telos?ciudad=${encodeURIComponent(ciudadName)}`)
        if (response.ok) {
          const data = await response.json()
          setTelos(data)
        }
      } catch (error) {
        console.error("Error fetching telos:", error)
        // Fallback a datos mock si la API falla
        const { mockTelos } = await import("@/lib/prisma")
        setTelos(mockTelos.filter((t) => t.ciudad.toLowerCase().includes(ciudadName.toLowerCase())))
      } finally {
        setLoading(false)
      }
    }

    fetchTelos()
  }, [ciudadName])

  const filteredTelos = telos.filter(
    (telo) =>
      telo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      telo.direccion.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
        <MobileHeader />
        <div className="px-4 py-8">
          <div className="max-w-md mx-auto space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <MobileHeader />

      {/* Header */}
      <div className="px-4 py-4 bg-white border-b border-purple-100">
        <h1 className="text-xl font-bold text-gray-900 capitalize mb-2">Telos en {ciudadName}</h1>
        <p className="text-sm text-gray-600">{filteredTelos.length} lugares disponibles</p>
      </div>

      {/* Search & Filters */}
      <div className="px-4 py-4 bg-white border-b border-purple-100">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar por nombre o zona..."
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
            Filtros
          </Button>

          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-full"
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "map" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("map")}
              className="rounded-full"
            >
              <Map className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Filters Sidebar */}
        {showFilters && (
          <div className="w-80 p-4 bg-white border-r border-purple-100">
            <TelosFilters />
          </div>
        )}

        {/* Results */}
        <div className="flex-1 px-4 py-4">
          {viewMode === "list" ? (
            <div className="max-w-md mx-auto space-y-4">
              {filteredTelos.length > 0 ? (
                filteredTelos.map((telo) => <TeloCard key={telo.id} telo={telo} />)
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No se encontraron telos en {ciudadName}</p>
                  <Button onClick={() => window.history.back()} variant="outline" className="rounded-full">
                    Volver a buscar
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="h-96">
              <TelosMapWrapper telos={filteredTelos} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
