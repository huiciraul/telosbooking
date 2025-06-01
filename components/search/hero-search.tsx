"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Search, Navigation } from "lucide-react"

interface Ciudad {
  id: number
  nombre: string
  slug: string
  provincia?: string
  busquedas?: number
  total_telos?: number
}

export function HeroSearch() {
  const [location, setLocation] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [ciudades, setCiudades] = useState<Ciudad[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Cargar ciudades populares al montar el componente
  useEffect(() => {
    async function fetchCiudadesPopulares() {
      try {
        const response = await fetch("/api/ciudades/populares")
        if (response.ok) {
          const data = await response.json()
          setCiudades(data.data || [])
        }
      } catch (error) {
        console.error("Error cargando ciudades:", error)
      }
    }
    fetchCiudadesPopulares()
  }, [])

  const filteredCities = ciudades.filter((city) => city.nombre.toLowerCase().includes(location.toLowerCase()))

  const handleSearch = async () => {
    if (!location.trim()) return

    setLoading(true)

    try {
      // Registrar búsqueda de ciudad
      await fetch("/api/ciudad/buscar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: location.trim() }),
      })

      // Iniciar scraping si es necesario
      await fetch("/api/scraping/google-maps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: "telos albergues transitorios",
          location: location.trim(),
        }),
      })

      // Navegar a resultados
      const citySlug = location.toLowerCase().replace(/\s+/g, "-")
      router.push(`/telos-en/${citySlug}`)
    } catch (error) {
      console.error("Error en búsqueda:", error)
      // Navegar de todas formas
      const citySlug = location.toLowerCase().replace(/\s+/g, "-")
      router.push(`/telos-en/${citySlug}`)
    } finally {
      setLoading(false)
    }
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // En un caso real, usarías reverse geocoding
          setLocation("Buenos Aires")
        },
        (error) => {
          console.error("Error getting location:", error)
        },
      )
    }
  }

  return (
    <section className="px-4 py-8 lg:py-16">
      <div className="max-w-2xl mx-auto text-center">
        {/* Greeting */}
        <div className="mb-8 lg:mb-12">
          <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-2 lg:mb-4">¿Dónde estás?</h1>
          <p className="text-gray-600 lg:text-lg">Encontrá el telo perfecto cerca tuyo</p>
        </div>

        {/* Search */}
        <div className="relative mb-6 lg:mb-8">
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-500" />
            <Input
              placeholder="Ingresá tu ciudad o barrio"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value)
                setShowSuggestions(true)
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch()
                  setShowSuggestions(false)
                }
              }}
              className="pl-12 pr-12 h-14 lg:h-16 text-lg rounded-2xl border-2 border-purple-100 focus:border-purple-300 bg-white/80"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={getCurrentLocation}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl text-purple-600"
            >
              <Navigation className="w-5 h-5" />
            </Button>
          </div>

          {/* Suggestions */}
          {showSuggestions && (location || filteredCities.length > 0) && (
            <div className="absolute top-full left-0 right-0 bg-white rounded-2xl shadow-xl mt-2 z-10 overflow-hidden animate-fade-in max-h-60 overflow-y-auto">
              {location && filteredCities.length === 0 && (
                <button
                  onClick={() => {
                    setShowSuggestions(false)
                    handleSearch()
                  }}
                  className="w-full text-left p-4 hover:bg-purple-50 flex items-center space-x-3 transition-colors border-b"
                >
                  <Search className="w-4 h-4 text-purple-400" />
                  <span>Buscar "{location}"</span>
                </button>
              )}

              {filteredCities.map((city) => (
                <button
                  key={city.id}
                  onClick={() => {
                    setLocation(city.nombre)
                    setShowSuggestions(false)
                  }}
                  className="w-full text-left p-4 hover:bg-purple-50 flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-purple-400" />
                    <div>
                      <span className="font-medium">{city.nombre}</span>
                      {city.provincia && <span className="text-sm text-gray-500 ml-2">{city.provincia}</span>}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {city.total_telos && <span className="text-xs text-gray-500">{city.total_telos} telos</span>}
                    {city.busquedas && city.busquedas > 0 && (
                      <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                        {city.busquedas} búsquedas
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          disabled={!location.trim() || loading}
          className="w-full lg:w-auto lg:px-12 h-14 lg:h-16 text-lg font-semibold rounded-2xl gradient-primary hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Buscando...
            </>
          ) : (
            <>
              <Search className="w-5 h-5 mr-2" />
              Buscar ahora
            </>
          )}
        </Button>
      </div>
    </section>
  )
}
