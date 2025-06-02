import { ResponsiveHeader } from "@/components/layout/responsive-header"
import { Footer } from "@/components/layout/footer"
import { PopularDestinations } from "@/components/sections/popular-destinations"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, TrendingUp } from "lucide-react"
import Link from "next/link"

const todasLasCiudades = [
  { nombre: "Buenos Aires", provincia: "Buenos Aires", telos: 150, trending: true },
  { nombre: "Córdoba", provincia: "Córdoba", telos: 45, trending: true },
  { nombre: "Rosario", provincia: "Santa Fe", telos: 32, trending: false },
  { nombre: "Mendoza", provincia: "Mendoza", telos: 28, trending: false },
  { nombre: "La Plata", provincia: "Buenos Aires", telos: 25, trending: false },
  { nombre: "Mar del Plata", provincia: "Buenos Aires", telos: 22, trending: true },
  { nombre: "Tucumán", provincia: "Tucumán", telos: 18, trending: false },
  { nombre: "Salta", provincia: "Salta", telos: 15, trending: false },
  { nombre: "Santa Fe", provincia: "Santa Fe", telos: 12, trending: false },
  { nombre: "Neuquén", provincia: "Neuquén", telos: 10, trending: false },
  { nombre: "Corrientes", provincia: "Corrientes", telos: 8, trending: false },
  { nombre: "Resistencia", provincia: "Chaco", telos: 7, trending: false },
]

export default function DestinosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <ResponsiveHeader />

      <main>
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Todos los destinos</h1>
            <p className="text-xl text-gray-600 mb-8">Explora telos en más de 50 ciudades de Argentina</p>
            <Badge className="bg-purple-100 text-purple-700 px-4 py-2 text-sm">
              🗺️ {todasLasCiudades.reduce((acc, ciudad) => acc + ciudad.telos, 0)} telos disponibles
            </Badge>
          </div>
        </section>

        <PopularDestinations />

        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Todas las ciudades</h2>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {todasLasCiudades.map((ciudad, index) => {
                const slug = ciudad.nombre.toLowerCase().replace(/\s+/g, "-")

                return (
                  <Link key={index} href={`/telos-en/${slug}`}>
                    <Card className="hover:shadow-lg transition-all duration-200 group border-0 shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-purple-600" />
                            <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                              {ciudad.nombre}
                            </h3>
                          </div>
                          {ciudad.trending && (
                            <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Hot
                            </Badge>
                          )}
                        </div>

                        <p className="text-sm text-gray-600 mb-2">{ciudad.provincia}</p>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">{ciudad.telos} telos</span>
                          <span className="text-xs text-purple-600 font-medium">Ver todos →</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">¿No encuentras tu ciudad?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Estamos agregando nuevas ciudades constantemente. Si no encuentras tu ciudad, puedes buscarla directamente
              y nuestro sistema la agregará automáticamente.
            </p>
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-6">
                <p className="text-purple-800 font-medium">
                  💡 Tip: Usa el buscador principal para encontrar telos en cualquier ciudad de Argentina
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
