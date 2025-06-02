import { TeloCard } from "@/components/telos/telo-card"
import type { Telo } from "@/lib/models" // Asegúrate de que la ruta sea correcta

async function getTelos() {
  // Aquí puedes ajustar la URL si es necesario, pero debería ser relativa si está en el mismo dominio
  const res = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL}/api/telos`, {
    cache: "no-store", // Para asegurar que siempre se obtengan los datos más recientes
  })

  if (!res.ok) {
    // Esto capturará cualquier error de la API, aunque los logs de Vercel ya no muestren 500
    console.error("Failed to fetch telos:", res.status, res.statusText)
    return []
  }

  const data: Telo[] = await res.json() // La API devuelve directamente el array de telos
  console.log("TelosPage: Data received from /api/telos:", data.length, "telos")
  return data || [] // Retorna el array directamente
}

export default async function TelosPage() {
  const telos: Telo[] = await getTelos()

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 lg:p-12">
      <h1 className="text-3xl font-bold mb-8">Todos los Telos</h1>
      {telos.length === 0 ? (
        <p className="text-lg text-gray-600">No se encontraron telos.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-6xl">
          {telos.map((telo) => (
            <TeloCard key={telo.id} telo={telo} />
          ))}
        </div>
      )}
    </main>
  )
}
