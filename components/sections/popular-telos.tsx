"use client"

import { useEffect, useState } from "react"
import { TeloCard } from "@/components/telos/telo-card"
import { Button } from "@/components/ui/button"
import { RefreshCw, CheckCircle, AlertTriangle } from "lucide-react"
import { mockTelos } from "@/lib/models"
import type { Telo } from "@/lib/models"

export function PopularTelos() {
  const [telos, setTelos] = useState<Telo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const fetchTelos = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("🔍 Fetching telos from database...")
      const response = await fetch("/api/telos?limit=8")

      if (response.ok) {
        const data = await response.json()
        console.log(`✅ Telos fetched: ${Array.isArray(data) ? data.length : 0}`)

        // Asegurar que data es un array
        const telosArray = Array.isArray(data) ? data : []

        if (telosArray.length > 0) {
          setTelos(telosArray)
          setSuccess(true)
        } else {
          // Si no hay datos de la API, usar mock data
          console.log("No hay datos de la API, usando mock data")
          setTelos(mockTelos.slice(0, 8))
          setSuccess(true)
        }
      } else {
        throw new Error(`API Error: ${response.status}`)
      }
    } catch (error) {
      console.error("❌ Error fetching telos:", error)
      setError("Error cargando telos desde la base de datos")

      // Fallback a datos mock en caso de error
      console.log("Usando mock data como fallback")
      setTelos(mockTelos.slice(0, 8))
      setSuccess(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTelos()
  }, [])

  if (loading) {
    return (
      <section className="px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Populares cerca tuyo</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="px-4 py-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Populares cerca tuyo</h2>
          <div className="flex items-center space-x-2">
            {success && (
              <div className="flex items-center text-green-600 text-sm">
                <CheckCircle className="w-4 h-4 mr-1" />
                Datos cargados
              </div>
            )}
            <Button variant="outline" size="sm" onClick={fetchTelos} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Actualizar
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <p className="text-yellow-800 font-medium">Usando datos de ejemplo</p>
            </div>
          </div>
        )}

        {/* Grid de telos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.isArray(telos) && telos.length > 0 ? (
            telos.map((telo) => <TeloCard key={telo.id} telo={telo} />)
          ) : (
            <div className="col-span-full text-center py-8">
              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay telos disponibles</h3>
                <p className="text-gray-500 mb-4">
                  Parece que no hay telos en la base de datos. Puedes agregar algunos manualmente o usar el scraping.
                </p>
                <Button onClick={fetchTelos} disabled={loading}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Intentar de nuevo
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// Exportación por defecto para dynamic import
export default PopularTelos
