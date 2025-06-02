import { ResponsiveHeader } from "@/components/layout/responsive-header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"

export default function ExperienciasPage() {
  const experiences = [
    {
      title: "Escapadas Románticas",
      description: "Descubre moteles con ambientes íntimos y servicios especiales para parejas.",
      image: "/placeholder.svg?height=200&width=300",
      tags: ["Parejas", "Jacuzzi", "Cena"],
    },
    {
      title: "Viajes de Negocios",
      description:
        "Hoteles y albergues con comodidades para viajeros de negocios, como WiFi rápido y espacios de trabajo.",
      image: "/placeholder.svg?height=200&width=300",
      tags: ["WiFi", "Escritorio", "Silencioso"],
    },
    {
      title: "Aventuras en Solitario",
      description: "Alojamientos seguros y cómodos para quienes viajan solos y buscan privacidad.",
      image: "/placeholder.svg?height=200&width=300",
      tags: ["Seguridad", "Económico", "Privado"],
    },
    {
      title: "Estadías Familiares",
      description: "Hoteles con habitaciones amplias y servicios aptos para toda la familia.",
      image: "/placeholder.svg?height=200&width=300",
      tags: ["Familiar", "Amplio", "Desayuno"],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <ResponsiveHeader />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">Explora Experiencias</h1>
        <p className="text-lg text-gray-600 mb-8 text-center">
          Encuentra el tipo de alojamiento perfecto para cada ocasión.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiences.map((exp, index) => (
            <Card key={index} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <img src={exp.image || "/placeholder.svg"} alt={exp.title} className="w-full h-48 object-cover" />
              <CardContent className="p-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{exp.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{exp.description}</p>
                <div className="flex flex-wrap gap-2">
                  {exp.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
