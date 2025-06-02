"use client"

import { useState } from "react"
import { Waves, Car, DollarSign, Star, Wifi, Clock } from "lucide-react"

const filters = [
  { id: "jacuzzi", label: "Jacuzzi", icon: Waves, color: "bg-blue-100 text-blue-700" },
  { id: "cochera", label: "Cochera", icon: Car, color: "bg-green-100 text-green-700" },
  { id: "economico", label: "Económico", icon: DollarSign, color: "bg-yellow-100 text-yellow-700" },
  { id: "top", label: "Top rated", icon: Star, color: "bg-purple-100 text-purple-700" },
  { id: "wifi", label: "WiFi", icon: Wifi, color: "bg-indigo-100 text-indigo-700" },
  { id: "24hs", label: "24hs", icon: Clock, color: "bg-pink-100 text-pink-700" },
]

export function QuickFilters() {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])

  const toggleFilter = (filterId: string) => {
    setSelectedFilters((prev) => (prev.includes(filterId) ? prev.filter((id) => id !== filterId) : [...prev, filterId]))
  }

  return (
    <section className="px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center lg:text-left">Filtros rápidos</h3>

        <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
          {filters.map((filter) => {
            const isSelected = selectedFilters.includes(filter.id)
            const Icon = filter.icon

            return (
              <button
                key={filter.id}
                onClick={() => toggleFilter(filter.id)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-full border-2 transition-all
                  ${
                    isSelected
                      ? "border-primary-300 bg-primary-50 text-primary-700"
                      : "border-gray-200 bg-white text-gray-600 hover:border-primary-200"
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{filter.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
