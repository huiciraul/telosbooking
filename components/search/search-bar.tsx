"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { MapPin, CalendarIcon, Users, Search } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

const CIUDADES = ["Buenos Aires", "Córdoba", "Rosario", "Mendoza", "La Plata", "Mar del Plata"]

export function SearchBar() {
  const [lugar, setLugar] = useState("")
  const [checkIn, setCheckIn] = useState<Date>()
  const [checkOut, setCheckOut] = useState<Date>()
  const [huespedes, setHuespedes] = useState(2)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const router = useRouter()

  const filteredCiudades = CIUDADES.filter((ciudad) => ciudad.toLowerCase().includes(lugar.toLowerCase()))

  const handleSearch = () => {
    if (lugar) {
      const ciudadSlug = lugar.toLowerCase().replace(/\s+/g, "-")
      router.push(`/telos-en/${ciudadSlug}`)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col lg:flex-row bg-white rounded-full border border-gray-300 shadow-lg hover:shadow-xl transition-shadow">
        {/* Lugar */}
        <div className="flex-1 relative">
          <div className="p-4 lg:p-6">
            <label className="block text-xs font-semibold text-gray-900 mb-1">Lugar</label>
            <div className="relative">
              <Input
                placeholder="Explorar destinos"
                value={lugar}
                onChange={(e) => {
                  setLugar(e.target.value)
                  setShowSuggestions(true)
                }}
                onFocus={() => setShowSuggestions(true)}
                className="border-0 p-0 text-sm placeholder:text-gray-500 focus-visible:ring-0"
              />
              <MapPin className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>

            {/* Suggestions */}
            {showSuggestions && lugar && (
              <div className="absolute top-full left-0 right-0 bg-white border rounded-lg shadow-lg mt-1 z-50">
                {filteredCiudades.map((ciudad) => (
                  <button
                    key={ciudad}
                    onClick={() => {
                      setLugar(ciudad)
                      setShowSuggestions(false)
                    }}
                    className="w-full text-left p-3 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{ciudad}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="hidden lg:block w-px bg-gray-300"></div>

        {/* Check-in */}
        <div className="flex-1">
          <Popover>
            <PopoverTrigger asChild>
              <div className="p-4 lg:p-6 cursor-pointer hover:bg-gray-50 rounded-full">
                <label className="block text-xs font-semibold text-gray-900 mb-1">Check-in</label>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    {checkIn ? format(checkIn, "dd MMM", { locale: es }) : "¿Cuándo?"}
                  </span>
                  <CalendarIcon className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={checkIn}
                onSelect={setCheckIn}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="hidden lg:block w-px bg-gray-300"></div>

        {/* Check-out */}
        <div className="flex-1">
          <Popover>
            <PopoverTrigger asChild>
              <div className="p-4 lg:p-6 cursor-pointer hover:bg-gray-50 rounded-full">
                <label className="block text-xs font-semibold text-gray-900 mb-1">Check-out</label>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    {checkOut ? format(checkOut, "dd MMM", { locale: es }) : "¿Cuándo?"}
                  </span>
                  <CalendarIcon className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={checkOut}
                onSelect={setCheckOut}
                disabled={(date) => date < new Date() || (checkIn && date <= checkIn)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="hidden lg:block w-px bg-gray-300"></div>

        {/* Huéspedes */}
        <div className="flex-1">
          <Popover>
            <PopoverTrigger asChild>
              <div className="p-4 lg:p-6 cursor-pointer hover:bg-gray-50 rounded-full">
                <label className="block text-xs font-semibold text-gray-900 mb-1">Huéspedes</label>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    {huespedes} {huespedes === 1 ? "huésped" : "huéspedes"}
                  </span>
                  <Users className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Adultos</div>
                    <div className="text-sm text-gray-500">13 años o más</div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setHuespedes(Math.max(1, huespedes - 1))}
                      disabled={huespedes <= 1}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">{huespedes}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setHuespedes(Math.min(10, huespedes + 1))}
                      disabled={huespedes >= 10}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Search Button */}
        <div className="p-2">
          <Button
            onClick={handleSearch}
            className="h-12 w-12 lg:h-14 lg:w-14 rounded-full bg-primary hover:bg-primary-700 p-0"
            disabled={!lugar}
          >
            <Search className="h-5 w-5 text-white" />
          </Button>
        </div>
      </div>
    </div>
  )
}
