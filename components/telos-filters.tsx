"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

const AMENITIES = [
  "WiFi",
  "Estacionamiento",
  "Hidromasaje",
  "Aire Acondicionado",
  "TV Cable",
  "Frigobar",
  "Jacuzzi",
  "Sauna",
]

export function TelosFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(searchParams.get("amenities")?.split(",") || [])
  const [priceRange, setPriceRange] = useState([
    Number.parseInt(searchParams.get("precio_min") || "0"),
    Number.parseInt(searchParams.get("precio_max") || "10000"),
  ])

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    if (checked) {
      setSelectedAmenities([...selectedAmenities, amenity])
    } else {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity))
    }
  }

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams)

    if (selectedAmenities.length > 0) {
      params.set("amenities", selectedAmenities.join(","))
    } else {
      params.delete("amenities")
    }

    params.set("precio_min", priceRange[0].toString())
    params.set("precio_max", priceRange[1].toString())

    router.push(`?${params.toString()}`)
  }

  const clearFilters = () => {
    setSelectedAmenities([])
    setPriceRange([0, 10000])
    router.push(window.location.pathname)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtros</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Price Range */}
        <div>
          <h4 className="mb-3 font-medium">Rango de Precio</h4>
          <Slider value={priceRange} onValueChange={setPriceRange} max={10000} min={0} step={500} className="mb-2" />
          <div className="flex justify-between text-sm text-gray-600">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>

        {/* Amenities */}
        <div>
          <h4 className="mb-3 font-medium">Servicios</h4>
          <div className="space-y-2">
            {AMENITIES.map((amenity) => (
              <div key={amenity} className="flex items-center space-x-2">
                <Checkbox
                  id={amenity}
                  checked={selectedAmenities.includes(amenity)}
                  onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
                />
                <label htmlFor={amenity} className="text-sm">
                  {amenity}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button onClick={applyFilters} className="w-full">
            Aplicar Filtros
          </Button>
          <Button onClick={clearFilters} variant="outline" className="w-full">
            Limpiar Filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
