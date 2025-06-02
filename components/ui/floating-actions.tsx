"use client"

import { Button } from "@/components/ui/button"
import { Map, Navigation } from "lucide-react"

export function FloatingActions() {
  return (
    <div className="fixed bottom-6 right-4 flex flex-col space-y-3 z-40">
      {/* Map View */}
      <Button
        variant="secondary"
        size="sm"
        className="w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
      >
        <Map className="w-5 h-5" />
      </Button>

      {/* Near Me */}
      <Button
        variant="secondary"
        size="sm"
        className="w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
      >
        <Navigation className="w-5 h-5" />
      </Button>
    </div>
  )
}
