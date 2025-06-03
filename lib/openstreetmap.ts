// Servicio para búsqueda de lugares usando OpenStreetMap (Nominatim)
// Esto evita usar Google Places y consumir créditos

export interface OSMPlace {
  place_id: number
  licence: string
  osm_type: string
  osm_id: number
  boundingbox: string[]
  lat: string
  lon: string
  display_name: string
  class: string
  type: string
  importance: number
  address?: {
    city?: string
    town?: string
    village?: string
    state?: string
    country?: string
    country_code?: string
  }
}

export interface SimplifiedPlace {
  nombre: string
  provincia?: string
  pais?: string
  lat?: number
  lng?: number
  displayName: string
}

// Función para buscar lugares en Argentina usando OpenStreetMap
export async function buscarLugaresOSM(query: string): Promise<SimplifiedPlace[]> {
  if (!query || query.length < 3) return []

  try {
    // Usamos el servicio Nominatim de OpenStreetMap
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        query,
      )}&countrycodes=ar&format=json&addressdetails=1&limit=5`,
      {
        headers: {
          // Importante: Agregar un User-Agent válido como requiere Nominatim
          "User-Agent": "TelosBooking/1.0 (https://motelo.com.ar)",
        },
      },
    )

    if (!response.ok) {
      throw new Error(`Error en la búsqueda: ${response.status}`)
    }

    const data: OSMPlace[] = await response.json()

    // Transformar los resultados a un formato simplificado
    return data.map((place) => {
      const address = place.address || {}

      // Determinar el nombre de la ciudad/lugar
      const nombre = address.city || address.town || address.village || place.display_name.split(",")[0]

      // Determinar la provincia
      const provincia = address.state

      return {
        nombre,
        provincia,
        pais: address.country,
        lat: Number.parseFloat(place.lat),
        lng: Number.parseFloat(place.lon),
        displayName: place.display_name,
      }
    })
  } catch (error) {
    console.error("Error buscando lugares en OpenStreetMap:", error)
    return []
  }
}

// Función para verificar si un lugar está en Argentina
export function esLugarEnArgentina(place: SimplifiedPlace): boolean {
  return place.pais === "Argentina" || place.pais === "argentina"
}
