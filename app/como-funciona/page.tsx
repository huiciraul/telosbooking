import { ResponsiveHeader } from "@/components/layout/responsive-header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, MapPin, Phone, Filter, Map, Heart, Database, Zap, Clock, Shield } from "lucide-react"
import Link from "next/link"

const steps = [
  {
    icon: Search,
    title: "1. Busca tu ciudad",
    description:
      "Ingresa tu ciudad o barrio en el buscador principal. Tenemos telos en más de 50 ciudades de Argentina.",
    features: ["Búsqueda por ciudad", "Sugerencias automáticas", "Búsqueda en tiempo real"],
    color: "bg-blue-50 text-blue-600 border-blue-200",
  },
  {
    icon: Filter,
    title: "2. Filtra por tus preferencias",
    description: "Usa nuestros filtros para encontrar exactamente lo que buscas según precio, servicios y ubicación.",
    features: ["Filtro por precio", "Servicios (WiFi, Jacuzzi, etc.)", "Ubicación específica"],
    color: "bg-purple-50 text-purple-600 border-purple-200",
  },
  {
    icon: MapPin,
    title: "3. Explora los resultados",
    description: "Revisa la lista de telos disponibles con fotos, precios, servicios y ubicación en el mapa.",
    features: ["Vista de lista o mapa", "Fotos y descripciones", "Ratings y reseñas"],
    color: "bg-green-50 text-green-600 border-green-200",
  },
  {
    icon: Phone,
    title: "4. Contacta directamente",
    description: "Llama directamente al telo para consultar disponibilidad y hacer tu reserva.",
    features: ["Números de teléfono verificados", "Horarios de atención", "Información de contacto"],
    color: "bg-orange-50 text-orange-600 border-orange-200",
  },
]

const features = [
  {
    icon: Database,
    title: "Base de datos actualizada",
    description: "Más de 500 telos verificados en toda Argentina, actualizados constantemente.",
  },
  {
    icon: Zap,
    title: "Búsqueda en tiempo real",
    description: "Nuestro sistema busca automáticamente nuevos telos usando tecnología de scraping avanzada.",
  },
  {
    icon: Map,
    title: "Vista de mapa interactivo",
    description: "Encuentra telos cerca tuyo con nuestro mapa interactivo y navegación GPS.",
  },
  {
    icon: Shield,
    title: "Información verificada",
    description: "Todos los datos son verificados y actualizados regularmente para garantizar precisión.",
  },
  {
    icon: Clock,
    title: "Disponible 24/7",
    description: "Busca telos en cualquier momento del día. Muchos establecimientos atienden las 24 horas.",
  },
  {
    icon: Heart,
    title: "Guarda tus favoritos",
    description: "Marca tus telos favoritos para encontrarlos fácilmente en futuras búsquedas.",
  },
]

export default function ComoFuncionaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <ResponsiveHeader />

      <main>
        {/* Hero Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">¿Cómo funciona TelosBooking?</h1>
            <p className="text-xl text-gray-600 mb-8">
              La forma más fácil y rápida de encontrar telos y albergues transitorios en Argentina
            </p>
            <Badge className="bg-purple-100 text-purple-700 px-4 py-2 text-sm">🚀 Más de 500 telos disponibles</Badge>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">En 4 simples pasos</h2>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, index) => (
                <Card key={index} className={`border-2 ${step.color} hover:shadow-lg transition-all duration-300`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-white mb-4 mx-auto shadow-sm">
                      <step.icon className="w-8 h-8 text-purple-600" />
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">{step.title}</h3>

                    <p className="text-gray-600 text-sm mb-4 text-center">{step.description}</p>

                    <ul className="space-y-2">
                      {step.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-xs text-gray-500">
                          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">¿Qué puedes hacer en TelosBooking?</h2>
              <p className="text-lg text-gray-600">
                Todas las herramientas que necesitas para encontrar el telo perfecto
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div key={index} className="text-center group">
                  <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-100 text-purple-600 mb-4 mx-auto group-hover:scale-110 transition-transform duration-200">
                    <feature.icon className="w-8 h-8" />
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{feature.title}</h3>

                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-6">Tecnología de vanguardia</h2>
            <p className="text-lg text-purple-100 mb-8">
              Utilizamos inteligencia artificial y automatización para mantenerte siempre actualizado
            </p>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <Database className="w-8 h-8 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Base de datos Neon</h3>
                <p className="text-sm text-purple-100">PostgreSQL escalable y confiable</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <Zap className="w-8 h-8 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Automatización n8n</h3>
                <p className="text-sm text-purple-100">Scraping automático de nuevos telos</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <Shield className="w-8 h-8 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Datos verificados</h3>
                <p className="text-sm text-purple-100">Información actualizada y confiable</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Preguntas frecuentes</h2>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">¿Es gratis usar TelosBooking?</h3>
                  <p className="text-gray-600">
                    Sí, TelosBooking es completamente gratuito. Puedes buscar, filtrar y contactar telos sin ningún
                    costo.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">¿Cómo se mantiene actualizada la información?</h3>
                  <p className="text-gray-600">
                    Utilizamos tecnología de automatización que busca y actualiza información de telos constantemente,
                    además de verificaciones manuales.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">¿Puedo hacer reservas a través de la plataforma?</h3>
                  <p className="text-gray-600">
                    TelosBooking te conecta directamente con los establecimientos. Las reservas se realizan llamando
                    directamente al telo.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">¿Qué ciudades están disponibles?</h3>
                  <p className="text-gray-600">
                    Tenemos telos en más de 50 ciudades de Argentina, incluyendo Buenos Aires, Córdoba, Rosario, Mendoza
                    y muchas más.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-purple-50">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">¿Listo para encontrar tu telo ideal?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Comienza tu búsqueda ahora y descubre los mejores telos cerca tuyo
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700 px-8">
                <Link href="/">
                  <Search className="w-5 h-5 mr-2" />
                  Buscar Telos
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg" className="px-8">
                <Link href="/destinos">
                  <MapPin className="w-5 h-5 mr-2" />
                  Ver Ciudades
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
