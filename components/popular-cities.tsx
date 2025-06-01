import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

const cities = [
  { name: "Buenos Aires", count: 150, slug: "buenos-aires" },
  { name: "Córdoba", count: 45, slug: "cordoba" },
  { name: "Rosario", count: 32, slug: "rosario" },
  { name: "Mendoza", count: 28, slug: "mendoza" },
  { name: "La Plata", count: 25, slug: "la-plata" },
  { name: "Mar del Plata", count: 22, slug: "mar-del-plata" },
]

export function PopularCities() {
  return (
    <section className="px-4 py-16 bg-gray-50">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-8 text-3xl font-bold text-center text-gray-900">Ciudades Populares</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cities.map((city) => (
            <Link key={city.slug} href={`/telos-en/${city.slug}`}>
              <Card className="transition-shadow hover:shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900">{city.name}</h3>
                  <p className="text-sm text-gray-600">{city.count} telos disponibles</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
