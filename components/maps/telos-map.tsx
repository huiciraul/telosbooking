"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix para iconos de Leaflet
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
    rating: number
  }>
  center?: [number, number]
  zoom?: number
}

export function TelosMap({ telos, center = [-34.6037, -58.3816], zoom = 12 }: TelosMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Inicializar mapa
    const map = L.map(mapRef.current).setView(center, zoom)

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map)

    mapInstanceRef.current = map

    // Agregar marcadores
    telos.forEach((telo) => {
      // Si no tiene coordenadas, generar algunas aleatorias cerca del centro
      const lat = telo.lat || center[0] + (Math.random() - 0.5) * 0.1
      const lng = telo.lng || center[1] + (Math.random() - 0.5) * 0.1

      // Crear icono personalizado basado en precio
      const isExpensive = telo.precio > 4000
      const iconColor = isExpensive ? "red" : "blue"

      const customIcon = L.divIcon({
        html: `
          <div style="
            background-color: ${iconColor};
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border: 3px solid white;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 12px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          ">
            $${Math.round(telo.precio / 1000)}k
          </div>
        `,
        className: "custom-marker",
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      })

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map)

      // Popup con información del telo
      marker.bindPopup(`
        <div style="min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-weight: bold;">${telo.nombre}</h3>
          <p style="margin: 0 0 4px 0; color: #666; font-size: 14px;">${telo.direccion}</p>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: bold; color: #2563eb;">$${telo.precio}</span>
            <span style="color: #f59e0b;">★ ${telo.rating}</span>
          </div>
          <button 
            onclick="window.location.href='/telo/${telo.id}'" 
            style="
              margin-top: 8px;
              background: #2563eb;
              color: white;
              border: none;
              padding: 6px 12px;
              border-radius: 4px;
              cursor: pointer;
              width: 100%;
            "
          >
            Ver detalles
          </button>
        </div>
      `)
    })

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [telos, center, zoom])

  return <div ref={mapRef} className="w-full h-full rounded-lg" />
}
