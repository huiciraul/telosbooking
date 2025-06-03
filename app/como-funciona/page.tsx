import { ResponsiveHeader } from "@/components/layout/responsive-header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Clock, Search, MapPin } from "lucide-react"

export default function ComoFuncionaPage() {
  const steps = [
    {
      title: "Busca tu ciudad",
      description: "Ingresa el nombre de tu ciudad o utiliza la ubicación actual para encontrar telos cercanos.",
      icon: Search,
    },
    {
      title: "Explora opciones",
      description: "Navega por los diferentes telos disponibles, filtra por servicios y compara precios.",
      icon: MapPin,
    },
    {
      title: "Revisa detalles",
      description: "Consulta fotos, servicios, precios y opiniones de otros usuarios para tomar la mejor decisión.",
      icon: CheckCircle,
    },
    {
      title: "Contacta directamente",
      description: "Llama al establecimiento para consultar disponibilidad y hacer tu reserva.",
      icon: Clock,
    },
  ]

  const faqs = [
    {
      question: "¿Qué es un telo o albergue transitorio?",
      answer:
        "Los telos o albergues transitorios son establecimientos que ofrecen habitaciones por turnos de algunas horas, diseñados para brindar privacidad y comodidad a parejas. Cuentan con servicios especiales como jacuzzi, ambientación temática y estacionamiento privado.",
    },
    {
      question: "¿Cómo funciona la búsqueda?",
      answer:
        "Nuestra plataforma te permite buscar telos por ciudad o ubicación actual. Puedes filtrar por servicios, rango de precios y calificaciones para encontrar el lugar perfecto según tus preferencias.",
    },
    {
      question: "¿Puedo hacer reservas a través de la plataforma?",
      answer:
        "Actualmente no ofrecemos reservas directas. Te proporcionamos toda la información de contacto para que puedas llamar al establecimiento y consultar disponibilidad.",
    },
    {
      question: "¿La información es actualizada?",
      answer:
        "Trabajamos constantemente para mantener nuestra base de datos actualizada con la información más reciente sobre precios, servicios y disponibilidad de los establecimientos.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <ResponsiveHeader />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">¿Cómo Funciona?</h1>
        <p className="text-lg text-gray-600 mb-8 text-center max-w-3xl mx-auto">
          Motelos te ayuda a encontrar el mejor albergue transitorio o telo en tu ciudad de manera rápida y sencilla.
          Sigue estos simples pasos para encontrar el lugar perfecto.
        </p>

        {/* Pasos */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-16">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <Card key={index} className="border-purple-100">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Preguntas frecuentes */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Preguntas Frecuentes</h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
