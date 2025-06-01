import { Heart, MapPin, Phone } from "lucide-react"

const features = [
  {
    icon: Heart,
    title: "Busca un motel",
    description: "Filtra cientos de telos por zonas, barrios, rating y amenities",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: MapPin,
    title: "Revisa los detalles",
    description: "Encuentra tu hotel ideal revisando la información detallada del telo",
    color: "bg-pink-100 text-pink-600",
  },
  {
    icon: Phone,
    title: "Ponte en contacto",
    description: "Revisa los detalles de los turnos y simplemente contacta al telo",
    color: "bg-purple-100 text-purple-600",
  },
]

export function FeaturesSection() {
  return (
    <section className="px-4 py-16 bg-white">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className={`inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full ${feature.color}`}>
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
