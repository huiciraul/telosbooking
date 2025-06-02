import { ResponsiveHeader } from "@/components/layout/responsive-header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, MapPin, Calendar } from "lucide-react"

const experiencias = [
  {
    id: 1,
    usuario: "María G.",
    telo: "Hotel Palermo Premium",
    ciudad: "Buenos Aires",
    rating: 5,
    fecha: "Hace 2 días",
    comentario: "Excelente lugar, muy limpio y cómodo. El personal muy amable y discreto. Definitivamente volvería.",
    servicios: ["WiFi", "Jacuzzi", "Estacionamiento"],
  },
  {
    id: 2,
    usuario: "Carlos R.",
    telo: "Motel Belgrano Deluxe",
    ciudad: "Buenos Aires",
    rating: 4,
    fecha: "Hace 1 semana",
    comentario: "Muy buena ubicación y excelentes instalaciones. El jacuzzi es increíble. Precio justo.",
    servicios: ["Jacuzzi", "TV Cable", "Frigobar"],
  },
  {
    id: 3,
    usuario: "Ana L.",
    telo: "Albergue Villa Crespo",
    ciudad: "Buenos Aires",
    rating: 4,
    fecha: "Hace 2 semanas",
    comentario: "Lugar acogedor y bien ubicado. Buena relación calidad-precio. Recomendado para parejas.",
    servicios: ["WiFi", "Aire Acondicionado"],
  },
]

export default function ExperienciasPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <ResponsiveHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Experiencias de usuarios</h1>
            <p className="text-lg text-gray-600">Descubre qué opinan otros usuarios sobre los telos que han visitado</p>
          </div>

          <div className="space-y-6">
            {experiencias.map((exp) => (
              <Card key={exp.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{exp.telo}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                        <MapPin className="w-4 h-4" />
                        <span>{exp.ciudad}</span>
                        <span>•</span>
                        <Calendar className="w-4 h-4" />
                        <span>{exp.fecha}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < exp.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">"{exp.comentario}"</p>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {exp.servicios.map((servicio) => (
                        <Badge key={servicio} variant="secondary" className="text-xs">
                          {servicio}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>Por {exp.usuario}</span>
                      <Heart className="w-4 h-4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">¿Visitaste un telo?</h2>
                <p className="text-gray-600 mb-4">
                  Comparte tu experiencia y ayuda a otros usuarios a encontrar el lugar perfecto
                </p>
                <Badge className="bg-purple-600 hover:bg-purple-700">Próximamente: Sistema de reseñas</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
