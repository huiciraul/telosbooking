"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Search, Navigation, Database, Cloud } from "lucide-react"
import { obtenerTodasLasCiudades } from "@/lib/argentina-data"
import { buscarLugaresOSM, type SimplifiedPlace } from "@/lib/openstreetmap"
import { generateSlug } from "@/utils/generate-slug"

interface Ciudad {
  id?: number
  nombre: string
  slug?: string
  provincia?: string
  busquedas?: number
  total_telos?: number
}

export function HeroSearch() {
  const [location, setLocation] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [ciudadesDB, setCiudadesDB] = useState<Ciudad[]>([])
  const [ciudadesOSM, setCiudadesOSM] = useState<SimplifiedPlace[]>([])
  const [loading, setLoading] = useState(false)
  const [searchSource, setSearchSource] = useState<"db" | "osm" | "">("")
  const [ciudadesArgentina, setCiudadesArgentina] = useState<Ciudad[]>([])
  const searchTimeout = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()

  // Cargar ciudades de Argentina y ciudades populares al montar el componente
  useEffect(() => {
    // Cargar ciudades de Argentina
    const todasLasCiudades = obtenerTodasLasCiudades().map((ciudad) => ({
      nombre: ciudad.nombre,
      provincia: ciudad.provincia,
      slug: generateSlug(ciudad.nombre),
    }))
    setCiudadesArgentina(todasLasCiudades)

    // Cargar ciudades populares de la base de datos
    async function fetchCiudadesPopulares() {
      try {
        const response = await fetch("/api/ciudades/populares")
        if (response.ok) {
          const data = await response.json()
          setCiudadesDB(data.data || [])
        }
      } catch (error) {
        console.error("Error cargando ciudades:", error)
      }
    }
    fetchCiudadesPopulares()
  }, [])

  // Buscar en OpenStreetMap cuando cambia la ubicación
  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current)
    }

    if (location.length >= 3) {
      searchTimeout.current = setTimeout(async () => {
        const resultados = await buscarLugaresOSM(location)
        setCiudadesOSM(resultados)
      }, 300)
    } else {
      setCiudadesOSM([])
    }

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current)
      }
    }
  }, [location])

  // Filtrar ciudades de la base de datos y de Argentina
  const filteredDBCities = ciudadesDB.filter((city) => city.nombre.toLowerCase().includes(location.toLowerCase()))

  const filteredArgentinaCities = ciudadesArgentina.filter(
    (city) =>
      city.nombre.toLowerCase().includes(location.toLowerCase()) &&
      !filteredDBCities.some((dbCity) => dbCity.nombre.toLowerCase() === city.nombre.toLowerCase()),
  )

  // Función para manejar la búsqueda
  const handleSearch = async (selectedCity?: Ciudad | SimplifiedPlace) => {
    let cityName = ""
    let provinceName = ""

    if (selectedCity) {
      cityName = selectedCity.nombre
      provinceName = selectedCity.provincia || ""
    } else if (location.trim()) {
      cityName = location.trim()
    } else {
      return // No buscar si no hay ciudad
    }

    setLoading(true)

    try {
      // 1. Registrar búsqueda de ciudad
      await fetch("/api/ciudad/buscar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: cityName,
          provincia: provinceName,
        }),
      })

      // 2. Verificar si ya tenemos telos para esta ciudad
      const checkResponse = await fetch(`/api/telos/check?ciudad=${encodeURIComponent(cityName)}`)
      const checkData = await checkResponse.json()

      // 3. Solo hacer scraping si no hay telos y la fuente no es la base de datos
      if (!checkData.exists && searchSource !== "db") {
        console.log(`No hay telos para ${cityName}, iniciando búsqueda en tiempo real...`)

        // Activar búsqueda en n8n en paralelo (no esperar respuesta)
        fetch("/api/n8n/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ciudad: cityName,
            provincia: provinceName,
          }),
        }).catch((error) => console.log("n8n search error (non-blocking):", error))
      } else {
        console.log(`Ya existen telos para ${cityName}, omitiendo scraping`)
      }

      // 4. Navegar a resultados inmediatamente
      const citySlug = generateSlug(cityName)
      router.push(`/telos-en/${citySlug}`)
    } catch (error) {
      console.error("Error en búsqueda:", error)
      // Navegar de todas formas
      const citySlug = generateSlug(cityName)
      router.push(`/telos-en/${citySlug}`)
    } finally {
      setLoading(false)
    }
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // En un caso real, usarías reverse geocoding con OpenStreetMap
          setLocation("Buenos Aires")
          setSearchSource("db")
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
                setSearchSource("")
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
          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 bg-white rounded-2xl shadow-xl mt-2 z-10 overflow-hidden animate-fade-in max-h-60 overflow-y-auto">
              {/* Ciudades de la base de datos */}
              {filteredDBCities.length > 0 && (
                <div className="border-b border-gray-100">
                  <div className="px-4 py-2 bg-purple-50 text-xs font-medium text-purple-700 flex items-center">
                    <Database className="w-3 h-3 mr-1" />
                    Ciudades populares
                  </div>
                  {filteredDBCities.map((city) => (
                    <button
                      key={`db-${city.id || city.nombre}`}
                      onClick={() => {
                        setLocation(city.nombre)
                        setSearchSource("db")
                        setShowSuggestions(false)
                        handleSearch(city)
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

              {/* Ciudades de Argentina (capitales y ciudades importantes) */}
              {filteredArgentinaCities.length > 0 && (
                <div className="border-b border-gray-100">
                  <div className="px-4 py-2 bg-blue-50 text-xs font-medium text-blue-700 flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    Ciudades de Argentina
                  </div>
                  {filteredArgentinaCities.slice(0, 5).map((city) => (
                    <button
                      key={`ar-${city.nombre}`}
                      onClick={() => {
                        setLocation(city.nombre)
                        setSearchSource("osm")
                        setShowSuggestions(false)
                        handleSearch(city)
                      }}
                      className="w-full text-left p-4 hover:bg-blue-50 flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-4 h-4 text-blue-400" />
                        <div>
                          <span className="font-medium">{city.nombre}</span>
                          {city.provincia && <span className="text-sm text-gray-500 ml-2">{city.provincia}</span>}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Resultados de OpenStreetMap */}
              {ciudadesOSM.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-green-50 text-xs font-medium text-green-700 flex items-center">
                    <Cloud className="w-3 h-3 mr-1" />
                    Resultados de búsqueda
                  </div>
                  {ciudadesOSM.map((place, index) => (
                    <button
                      key={`osm-${index}`}
                      onClick={() => {
                        setLocation(place.nombre)
                        setSearchSource("osm")
                        setShowSuggestions(false)
                        handleSearch(place)
                      }}
                      className="w-full text-left p-4 hover:bg-green-50 flex items-center space-x-3 transition-colors"
                    >
                      <MapPin className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <div className="overflow-hidden">
                        <div className="font-medium truncate">{place.nombre}</div>
                        <div className="text-xs text-gray-500 truncate">{place.displayName}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Búsqueda manual */}
              {location &&
                filteredDBCities.length === 0 &&
                filteredArgentinaCities.length === 0 &&
                ciudadesOSM.length === 0 && (
                  <button
                    onClick={() => {
                      setShowSuggestions(false)
                      handleSearch()
                    }}
                    className="w-full text-left p-4 hover:bg-purple-50 flex items-center space-x-3 transition-colors border-b"
                  >
                    <Search className="w-4 h-4 text-purple-400" />
                    <span>Buscar "{location}"</span>
                    <Cloud className="w-4 h-4 text-blue-400 ml-auto" />
                  </button>
                )}

              {/* Sin resultados */}
              {location &&
                filteredDBCities.length === 0 &&
                filteredArgentinaCities.length === 0 &&
                ciudadesOSM.length === 0 && (
                  <div className="p-4 text-center text-gray-500">No se encontraron resultados para "{location}"</div>
                )}
            </div>
          )}
        </div>

        {/* Search Button */}
        <Button
          onClick={() => handleSearch()}
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

        {/* Info */}
        <p className="text-xs text-gray-500 mt-4 flex items-center justify-center space-x-1">
          <MapPin className="w-3 h-3" />
          <span>Busca entre {ciudadesDB.length + ciudadesArgentina.length} ciudades de Argentina</span>
        </p>
      </div>
    </section>
  )
}
