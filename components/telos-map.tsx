"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

interface TelosMapProps {
  telos: Array<{
    id: string
    nombre: string
    direccion: string
    lat?: number
    lng?: number
    precio: number
  }>
}

export default function TelosMap({ telos }: TelosMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Initialize map
    const map = L.map(mapRef.current).setView([-34.6037, -58.3816], 12) // Buenos Aires center

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map)

    mapInstanceRef.current = map

    // Add markers for telos with coordinates
    telos.forEach((telo, index) => {
      // For demo purposes, generate random coordinates around Buenos Aires
      const lat = -34.6037 + (Math.random() - 0.5) * 0.1
      const lng = -58.3816 + (Math.random() - 0.5) * 0.1

      const marker = L.marker([lat, lng]).addTo(map)

      marker.bindPopup(`
        <div class="p-2">
          <h3 class="font-semibold">${telo.nombre}</h3>
          <p class="text-sm text-gray-600">${telo.direccion}</p>
          <p class="text-lg font-bold text-purple-600">$${telo.precio}</p>
        </div>
      `)
    })

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [telos])

  return (
    <div className="h-96 bg-gray-100 rounded-lg overflow-hidden">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  )
}
