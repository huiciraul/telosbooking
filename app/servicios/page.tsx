import { ResponsiveHeader } from "@/components/layout/responsive-header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wifi, Car, Waves, Tv, Snowflake, Coffee, Shield, Clock } from "lucide-react"

const servicios = [
  {
    icon: Wifi,
    nombre: "WiFi Gratuito",
    descripcion: "Conexión a internet de alta velocidad disponible en todas las habitaciones",
    disponibilidad: "95% de los telos",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Car,
    nombre: "Estacionamiento",
    descripcion: "Cochera privada y segura para tu vehículo",
    disponibilidad: "80% de los telos",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: Waves,
    nombre: "Jacuzzi/Hidromasaje",
    descripcion: "Bañera con hidromasaje para una experiencia relajante",
    disponibilidad: "60% de los telos",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: Snowflake,
    nombre: "Aire Acondicionado",
    descripcion: "Climatización para tu comodidad en cualquier época del año",
    disponibilidad: "90% de los telos",
    color: "bg-cyan-50 text-cyan-600",
  },
  {
    icon: Tv,
    nombre: "TV Cable/Streaming",
    descripcion: "Televisión con canales premium y servicios de streaming",
    disponibilidad: "85% de los telos",
    color: "bg-orange-50 text-orange-600",
  },
  {
    icon: Coffee,
    nombre: "Frigobar",
    descripcion: "Minibar con bebidas y snacks para tu comodidad",
    disponibilidad: "70% de los telos",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: Shield,
    nombre: "Seguridad 24hs",
    descripcion: "Personal de seguridad y sistemas de vigilancia las 24 horas",
    disponibilidad: "75% de los telos",
    color: "bg-red-50 text-red-600",
  },
  {
    icon: Clock,
    nombre: "Atención 24hs",
    descripcion: "Servicio disponible las 24 horas del día, todos los días",
    disponibilidad: "65% de los telos",
    color: "bg-indigo-50 text-indigo-600",
  },
]

export default function ServiciosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <ResponsiveHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Servicios disponibles</h1>
            <p className="text-lg text-gray-600">
              Descubre todos los servicios y comodidades que ofrecen los telos en nuestra plataforma
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {servicios.map((servicio, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-6">
                  <div
                    className={`w-12 h-12 rounded-xl ${servicio.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <servicio.icon className="w-6 h-6" />
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-2">{servicio.nombre}</h3>

                  <p className="text-sm text-gray-600 mb-3">{servicio.descripcion}</p>

                  <Badge variant="secondary" className="text-xs">
                    {servicio.disponibilidad}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-16">
            <Card className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">¿Buscas un servicio específico?</h2>
                <p className="text-purple-100 mb-6">
                  Usa nuestros filtros avanzados para encontrar telos que ofrezcan exactamente lo que necesitas
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {["WiFi", "Jacuzzi", "Estacionamiento", "24hs", "Frigobar"].map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-white/20 text-white border-white/30">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Servicios Premium</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Suites con jacuzzi privado</li>
                  <li>• Servicio de habitaciones</li>
                  <li>• Amenities de lujo</li>
                  <li>• Sistemas de sonido premium</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Servicios Básicos</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Habitaciones limpias y cómodas</li>
                  <li>• Baño privado con ducha</li>
                  <li>• Ropa de cama limpia</li>
                  <li>• Recepción discreta</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
