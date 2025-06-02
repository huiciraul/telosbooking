import { ResponsiveHeader } from "@/components/layout/responsive-header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, MapPin, Phone, Filter, HelpCircle, MessageCircle } from "lucide-react"

const faqs = [
  {
    pregunta: "¿Cómo busco telos en mi ciudad?",
    respuesta:
      "Simplemente ingresa tu ciudad en el buscador principal de la página de inicio. Nuestro sistema te mostrará todos los telos disponibles en tu área.",
  },
  {
    pregunta: "¿Es gratis usar TelosBooking?",
    respuesta: "Sí, TelosBooking es completamente gratuito. Puedes buscar, filtrar y contactar telos sin ningún costo.",
  },
  {
    pregunta: "¿Cómo hago una reserva?",
    respuesta:
      "TelosBooking te conecta directamente con los establecimientos. Para hacer una reserva, debes llamar directamente al número de teléfono del telo.",
  },
  {
    pregunta: "¿Los precios están actualizados?",
    respuesta:
      "Trabajamos constantemente para mantener los precios actualizados, pero te recomendamos confirmar el precio al contactar directamente con el establecimiento.",
  },
  {
    pregunta: "¿Puedo filtrar por servicios específicos?",
    respuesta:
      "Sí, puedes usar nuestros filtros para buscar telos que ofrezcan servicios específicos como WiFi, jacuzzi, estacionamiento, etc.",
  },
  {
    pregunta: "¿Cómo sé si un telo está disponible?",
    respuesta:
      "La disponibilidad cambia constantemente. Te recomendamos llamar directamente al telo para consultar disponibilidad en tiempo real.",
  },
]

export default function AyudaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <ResponsiveHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Centro de Ayuda</h1>
            <p className="text-lg text-gray-600">
              Encuentra respuestas a las preguntas más frecuentes sobre TelosBooking
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Preguntas Frecuentes</h2>

              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <HelpCircle className="w-5 h-5 text-purple-600 mr-2" />
                        {faq.pregunta}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">{faq.respuesta}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">¿Necesitas más ayuda?</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Si no encuentras la respuesta que buscas, contáctanos directamente.
                  </p>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contactar Soporte
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Guía Rápida</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <Search className="w-4 h-4 text-purple-600" />
                      <span>Busca por ciudad o barrio</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Filter className="w-4 h-4 text-purple-600" />
                      <span>Filtra por precio y servicios</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-purple-600" />
                      <span>Ve la ubicación en el mapa</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-purple-600" />
                      <span>Llama para reservar</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Estado del Sistema</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Base de datos</span>
                      <Badge className="bg-green-100 text-green-700">Operativo</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Búsqueda</span>
                      <Badge className="bg-green-100 text-green-700">Operativo</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Mapas</span>
                      <Badge className="bg-green-100 text-green-700">Operativo</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
