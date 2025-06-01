import { Heart, MapPin, Phone } from "lucide-react"

const features = [
  {
    icon: Heart,
    title: "Busca un motel",
    description: "Filtra cientos de telos por zonas, barrios, rating y amenities",
    color: "bg-primary-50 text-primary-600",
  },
  {
    icon: MapPin,
    title: "Revisa los detalles",
    description: "Encuentra tu hotel ideal revisando la información detallada del telo",
    color: "bg-secondary-50 text-secondary-600",
  },
  {
    icon: Phone,
    title: "Ponte en contacto",
    description: "Revisa los detalles de los turnos y simplemente contacta al telo",
    color: "bg-primary-50 text-primary-600",
  },
]

const stats = [
  { number: "500+", label: "Telos disponibles" },
  { number: "50+", label: "Ciudades" },
  { number: "24/7", label: "Disponibilidad" },
  { number: "4.8★", label: "Rating promedio" },
]

export function FeaturesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Stats */}
        <div className="mb-20">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-primary lg:text-4xl">{stat.number}</div>
                <div className="text-sm text-muted-foreground lg:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 lg:text-4xl">¿Cómo funciona TelosBooking?</h2>
            <p className="text-lg text-muted-foreground">Encontrar tu telo ideal nunca fue tan fácil</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div key={index} className="group text-center">
                <div
                  className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl ${feature.color} mb-6 transition-transform duration-200 group-hover:scale-110`}
                >
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
