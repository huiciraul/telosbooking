import { Search, MapPin, Phone, CheckCircle } from "lucide-react"

const steps = [
  {
    icon: Search,
    title: "1. Busca",
    description: "Selecciona tu ciudad y filtra por servicios, precio o ubicación",
  },
  {
    icon: MapPin,
    title: "2. Explora",
    description: "Revisa detalles, fotos, servicios y ubicación en el mapa",
  },
  {
    icon: Phone,
    title: "3. Contacta",
    description: "Llama directamente al telo para consultar disponibilidad",
  },
  {
    icon: CheckCircle,
    title: "4. Disfruta",
    description: "Relájate y disfruta de tu experiencia en el telo elegido",
  },
]

export function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 lg:text-4xl">Así de fácil es usar TelosBooking</h2>
            <p className="text-lg text-muted-foreground">En solo 4 pasos encontrás el telo perfecto para vos</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={index} className="relative text-center">
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="absolute top-8 left-1/2 hidden h-0.5 w-full bg-gradient-to-r from-primary to-primary-300 lg:block" />
                )}

                <div className="relative z-10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white shadow-lg">
                  <step.icon className="h-8 w-8" />
                </div>

                <h3 className="mb-3 text-lg font-semibold text-gray-900">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
