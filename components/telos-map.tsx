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
    id?: string | number
    nombre?: string
    direccion?: string
    lat?: number
    lng?: number
    precio?: number
    rating?: number
  }>
}

export default function TelosMap({ telos = [] }: TelosMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Verificar que telos es un array
    if (!Array.isArray(telos) || telos.length === 0) {
      console.warn("TelosMap: telos no es un array válido o está vacío")
      return
    }

    // Initialize map
    const map = L.map(mapRef.current).setView([-34.6037, -58.3816], 12) // Buenos Aires center

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map)

    mapInstanceRef.current = map

    // Add markers for telos with coordinates
    telos.forEach((telo, index) => {
      if (!telo) return // Skip if telo is undefined

      // For demo purposes, generate random coordinates around Buenos Aires
      const lat = telo.lat || -34.6037 + (Math.random() - 0.5) * 0.1
      const lng = telo.lng || -58.3816 + (Math.random() - 0.5) * 0.1
      const nombre = telo.nombre || "Telo sin nombre"
      const direccion = telo.direccion || "Dirección no disponible"
      const precio = telo.precio || 0

      const marker = L.marker([lat, lng]).addTo(map)

      marker.bindPopup(`
        <div class="p-2">
          <h3 class="font-semibold">${nombre}</h3>
          <p class="text-sm text-gray-600">${direccion}</p>
          <p class="text-lg font-bold text-purple-600">$${precio}</p>
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
    <div className="h-full bg-gray-100 rounded-lg overflow-hidden">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  )
}
