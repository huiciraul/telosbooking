import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, TrendingUp } from "lucide-react"

const cities = [
  { name: "Buenos Aires", count: 150, slug: "buenos-aires", trending: true },
  { name: "Córdoba", count: 45, slug: "cordoba", trending: false },
  { name: "Rosario", count: 32, slug: "rosario", trending: true },
  { name: "Mendoza", count: 28, slug: "mendoza", trending: false },
  { name: "La Plata", count: 25, slug: "la-plata", trending: false },
  { name: "Mar del Plata", count: 22, slug: "mar-del-plata", trending: true },
]

export function PopularCities() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 lg:text-4xl">Ciudades Populares</h2>
            <p className="text-lg text-muted-foreground">
              Descubre los mejores telos en las principales ciudades de Argentina
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cities.map((city) => (
              <Link key={city.slug} href={`/telos-en/${city.slug}`}>
                <Card className="group transition-all duration-200 hover:shadow-xl hover:-translate-y-1 border-0 shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50">
                          <MapPin className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
                            {city.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">{city.count} telos disponibles</p>
                        </div>
                      </div>
                      {city.trending && (
                        <Badge variant="secondary" className="bg-secondary-50 text-secondary-700 border-secondary-200">
                          <TrendingUp className="mr-1 h-3 w-3" />
                          Trending
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Desde <span className="font-semibold text-primary">$2,200</span> por turno
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
