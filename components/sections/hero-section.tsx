"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { MapPin, Search, Star } from "lucide-react"

const CIUDADES = ["Buenos Aires", "Córdoba", "Rosario", "Mendoza", "La Plata", "Mar del Plata"]
const POPULAR_SEARCHES = ["Palermo", "Estacionamiento", "Hidromasajes", "Jacuzzi", "WiFi"]

export function HeroSection() {
  const [zona, setZona] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  const handleSearch = () => {
    if (zona) {
      const ciudadSlug = zona.toLowerCase().replace(/\s+/g, "-")
      router.push(`/telos-en/${ciudadSlug}`)
    }
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-700">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fillRule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23ffffff&quot; fillOpacity=&quot;0.05&quot;%3E%3Ccircle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;2&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>

      <div className="relative container mx-auto px-4 py-20 lg:py-32">
        <div className="mx-auto max-w-4xl text-center text-white">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-sm">
            <Star className="mr-2 h-4 w-4" />
            TELOS Y ALBERGUES TRANSITORIOS
          </div>

          {/* Main Heading */}
          <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight lg:text-6xl">
            Encontrá tu telo ideal
            <span className="block text-primary-200">en segundos</span>
          </h1>

          {/* Subtitle */}
          <p className="mb-12 text-lg text-primary-100 lg:text-xl">
            Explorá por ciudad, barrio o servicios. La forma más fácil de encontrar albergues transitorios en Argentina
            para parejas, viajeros y cualquier persona que busque privacidad y comodidad.
          </p>

          {/* Search Form */}
          <div className="mx-auto max-w-4xl">
            <div className="rounded-2xl bg-white p-6 shadow-2xl">
              <div className="flex flex-col gap-4 lg:flex-row">
                <div className="flex-1">
                  <Select value={zona} onValueChange={setZona}>
                    <SelectTrigger className="h-14 text-left border-0 bg-gray-50 text-lg">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-primary" />
                        <SelectValue placeholder="Seleccionar ciudad" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {CIUDADES.map((ciudad) => (
                        <SelectItem key={ciudad} value={ciudad} className="text-lg">
                          {ciudad}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary" />
                    <Input
                      placeholder="Buscar por barrio o servicio..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="h-14 pl-12 border-0 bg-gray-50 text-lg"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleSearch}
                  className="h-14 px-8 bg-primary hover:bg-primary-700 text-lg font-semibold rounded-xl transition-all duration-200 hover:scale-105"
                  disabled={!zona}
                >
                  <Search className="mr-2 h-5 w-5" />
                  Buscar Telos
                </Button>
              </div>
            </div>
          </div>

          {/* Popular Searches */}
          <div className="mt-8">
            <p className="mb-4 text-sm text-primary-200">Búsquedas populares:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {POPULAR_SEARCHES.map((tag) => (
                <button
                  key={tag}
                  className="rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm transition-all duration-200 hover:bg-white/30 hover:scale-105"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
