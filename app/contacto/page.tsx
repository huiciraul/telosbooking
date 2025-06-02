import { ResponsiveHeader } from "@/components/layout/responsive-header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MapPin, Phone, Clock } from "lucide-react"

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <ResponsiveHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Contáctanos</h1>
            <p className="text-lg text-gray-600">¿Tienes alguna pregunta o sugerencia? Nos encantaría escucharte</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Envíanos un mensaje</h2>

                <form className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                      <Input placeholder="Tu nombre" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <Input type="email" placeholder="tu@email.com" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Asunto</label>
                    <Input placeholder="¿En qué podemos ayudarte?" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje</label>
                    <Textarea placeholder="Escribe tu mensaje aquí..." rows={6} />
                  </div>

                  <Button className="w-full bg-purple-600 hover:bg-purple-700">Enviar mensaje</Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Información de contacto</h3>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-gray-600">info@telosbooking.com</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="font-medium">Teléfono</p>
                        <p className="text-gray-600">+54 11 1234-5678</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="font-medium">Ubicación</p>
                        <p className="text-gray-600">Buenos Aires, Argentina</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="font-medium">Horario de atención</p>
                        <p className="text-gray-600">Lunes a Viernes: 9:00 - 18:00</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">¿Eres propietario de un telo?</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Si tienes un telo y quieres aparecer en nuestra plataforma, contáctanos para más información.
                  </p>
                  <Button variant="outline" className="w-full border-purple-300 text-purple-700 hover:bg-purple-100">
                    Información para propietarios
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Reportar un problema</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Si encontraste información incorrecta o tienes algún problema técnico, repórtalo aquí.
                  </p>
                  <Button variant="outline" className="w-full">
                    Reportar problema
                  </Button>
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
