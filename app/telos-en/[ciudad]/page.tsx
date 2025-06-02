"use client"

import { useState, useEffect } from "react"
import { MobileHeader } from "@/components/layout/mobile-header"
import { TeloCard } from "@/components/telos/telo-card"
import { TelosFilters } from "@/components/telos-filters"
import { TelosMapWrapper } from "@/components/telos-map-wrapper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Map, List, Filter, Search, RefreshCw, Database, Cloud } from "lucide-react"
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
  const [loadingN8n, setLoadingN8n] = useState(false)
  const [dataSource, setDataSource] = useState<"database" | "n8n" | "mixed">("database")

  const ciudadName = params.ciudad.replace(/-/g, " ")

  const fetchTelosFromDatabase = async () => {
    try {
      console.log("🔍 Buscando en base de datos...")
      const response = await fetch(`/api/telos?ciudad=${encodeURIComponent(ciudadName)}`)
      if (response.ok) {
        const data = await response.json()
        console.log(`📊 Encontrados ${data.length} telos en BD`)
        return data
      }
      return []
    } catch (error) {
      console.error("Error fetching from database:", error)
      return []
    }
  }

  const fetchTelosFromN8n = async () => {
    try {
      setLoadingN8n(true)
      console.log("🔍 Buscando en n8n...")
      const response = await fetch("/api/n8n/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ciudad: ciudadName }),
      })

      if (response.ok) {
        const data = await response.json()
        console.log(`📊 Encontrados ${data.telos?.length || 0} telos en n8n`)
        return data.telos || []
      }
      return []
    } catch (error) {
      console.error("Error fetching from n8n:", error)
      return []
    } finally {
      setLoadingN8n(false)
    }
  }

  const fetchTelos = async () => {
    setLoading(true)

    // Primero intentar base de datos
    const dbTelos = await fetchTelosFromDatabase()

    if (dbTelos.length > 0) {
      setTelos(dbTelos)
      setDataSource("database")
      console.log("✅ Usando datos de la base de datos")
    } else {
      // Si no hay datos en BD, buscar en n8n
      console.log("📡 No hay datos en BD, buscando en n8n...")
      const n8nTelos = await fetchTelosFromN8n()

      if (n8nTelos.length > 0) {
        setTelos(n8nTelos)
        setDataSource("n8n")
        console.log("✅ Usando datos de n8n")
      } else {
        // Fallback a datos mock
        console.log("📦 Usando datos mock como fallback")
        const { mockTelos } = await import("@/lib/prisma")
        setTelos(mockTelos.filter((t) => t.ciudad.toLowerCase().includes(ciudadName.toLowerCase())))
        setDataSource("database")
      }
    }

    setLoading(false)
  }

  const refreshFromN8n = async () => {
    const n8nTelos = await fetchTelosFromN8n()
    if (n8nTelos.length > 0) {
      setTelos(n8nTelos)
      setDataSource("n8n")
    }
  }

  useEffect(() => {
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
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-bold text-gray-900 capitalize">Telos en {ciudadName}</h1>
          <div className="flex items-center space-x-2">
            <Badge variant={dataSource === "database" ? "default" : "secondary"}>
              <Database className="w-3 h-3 mr-1" />
              {dataSource === "database" ? "BD" : "n8n"}
            </Badge>
            <Button variant="outline" size="sm" onClick={refreshFromN8n} disabled={loadingN8n} className="rounded-full">
              {loadingN8n ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Cloud className="w-4 h-4" />}
            </Button>
          </div>
        </div>
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

      {/* Data Source Info */}
      {dataSource === "n8n" && (
        <div className="px-4 py-2 bg-blue-50 border-b border-blue-100">
          <div className="flex items-center justify-center space-x-2 text-blue-700 text-sm">
            <Cloud className="w-4 h-4" />
            <span>Datos obtenidos en tiempo real desde n8n</span>
          </div>
        </div>
      )}

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
                  <div className="space-y-2">
                    <Button onClick={refreshFromN8n} disabled={loadingN8n} className="rounded-full">
                      {loadingN8n ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Buscando en n8n...
                        </>
                      ) : (
                        <>
                          <Cloud className="w-4 h-4 mr-2" />
                          Buscar en tiempo real
                        </>
                      )}
                    </Button>
                    <Button onClick={() => window.history.back()} variant="outline" className="rounded-full">
                      Volver a buscar
                    </Button>
                  </div>
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
