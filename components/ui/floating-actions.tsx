"use client"

import { Button } from "@/components/ui/button"
import { Map, Navigation, Plus } from "lucide-react"

export function FloatingActions() {
  return (
    <div className="fixed bottom-6 right-4 flex flex-col space-y-3 z-40">
      {/* Add Telo */}
      <Button size="sm" className="w-12 h-12 rounded-full gradient-primary shadow-lg hover:shadow-xl transition-all">
        <Plus className="w-5 h-5" />
      </Button>

      {/* Map View */}
      <Button
        variant="secondary"
        size="sm"
        className="w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl transition-all"
      >
        <Map className="w-5 h-5" />
      </Button>

      {/* Near Me */}
      <Button
        variant="secondary"
        size="sm"
        className="w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl transition-all"
      >
        <Navigation className="w-5 h-5" />
      </Button>
    </div>
  )
}
