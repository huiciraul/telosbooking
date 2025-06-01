"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Search } from "lucide-react"

const CIUDADES = ["Buenos Aires", "Córdoba", "Rosario", "Mendoza", "La Plata", "Mar del Plata", "Tucumán", "Salta"]

const BARRIOS_BA = ["Palermo", "Villa Crespo", "Belgrano", "Caballito", "Flores", "San Telmo", "Recoleta", "Barracas"]

export function SearchForm() {
  const [zona, setZona] = useState("")
  const [barrio, setBarrio] = useState("")
  const router = useRouter()

  const handleSearch = () => {
    if (zona) {
      const ciudadSlug = zona.toLowerCase().replace(/\s+/g, "-")
      router.push(`/telos-en/${ciudadSlug}`)
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-2xl md:flex-row">
        <div className="flex-1">
          <Select value={zona} onValueChange={setZona}>
            <SelectTrigger className="h-12 text-left">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <SelectValue placeholder="Zona" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {CIUDADES.map((ciudad) => (
                <SelectItem key={ciudad} value={ciudad}>
                  {ciudad}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <Select value={barrio} onValueChange={setBarrio}>
            <SelectTrigger className="h-12 text-left">
              <SelectValue placeholder="Barrio" />
            </SelectTrigger>
            <SelectContent>
              {BARRIOS_BA.map((b) => (
                <SelectItem key={b} value={b}>
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleSearch} className="h-12 px-8 bg-purple-600 hover:bg-purple-700" disabled={!zona}>
          <Search className="w-4 h-4 mr-2" />
          Buscar
        </Button>
      </div>
    </div>
  )
}
