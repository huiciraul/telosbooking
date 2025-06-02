import { ResponsiveHeader } from "@/components/layout/responsive-header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Wifi, Car, Waves, Tv, Coffee, Snowflake, Utensils, BedSingle } from "lucide-react"

export default function ServiciosPage() {
  const services = [
    {
      name: "WiFi Gratuito",
      description: "Conexión a internet de alta velocidad en todas las áreas.",
      icon: Wifi,
    },
    {
      name: "Estacionamiento Privado",
      description: "Espacio seguro para tu vehículo dentro del establecimiento.",
      icon: Car,
    },
    {
      name: "Hidromasaje / Jacuzzi",
      description: "Relájate en bañeras con hidromasaje en tu habitación.",
      icon: Waves,
    },
    {
      name: "TV por Cable",
      description: "Acceso a una amplia variedad de canales de televisión.",
      icon: Tv,
    },
    {
      name: "Servicio de Cafetería",
      description: "Disfruta de bebidas calientes y snacks en tu habitación.",
      icon: Coffee,
    },
    {
      name: "Aire Acondicionado",
      description: "Ambientes climatizados para tu confort.",
      icon: Snowflake,
    },
    {
      name: "Restaurante",
      description: "Opciones de comida y bebida disponibles en el lugar.",
      icon: Utensils,
    },
    {
      name: "Habitaciones Temáticas",
      description: "Experiencias únicas con decoraciones y ambientes especiales.",
      icon: BedSingle,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <ResponsiveHeader />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">Servicios Comunes</h1>
        <p className="text-lg text-gray-600 mb-8 text-center">
          Descubre los servicios más buscados en moteles y telos.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <Card key={index} className="shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex items-center space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{service.name}</h3>
                    <p className="text-gray-600 text-sm">{service.description}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </main>
      <Footer />
    </div>
  )
}
