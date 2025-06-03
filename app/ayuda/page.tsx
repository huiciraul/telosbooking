import { ResponsiveHeader } from "@/components/layout/responsive-header"
import { Footer } from "@/components/layout/footer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function AyudaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <ResponsiveHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">Centro de Ayuda</h1>
          <p className="text-lg text-gray-600 mb-8 text-center">
            Encuentra respuestas a tus preguntas frecuentes sobre Motelos.
          </p>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>¿Cómo busco un motel?</AccordionTrigger>
              <AccordionContent>
                Puedes buscar moteles ingresando una ciudad o barrio en la barra de búsqueda de la página principal.
                También puedes usar los filtros rápidos para encontrar moteles con servicios específicos.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>¿Cómo contacto a un motel?</AccordionTrigger>
              <AccordionContent>
                En la página de detalles de cada motel, encontrarás un botón para llamar directamente al establecimiento
                o su número de teléfono.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>¿Motelos ofrece reservas?</AccordionTrigger>
              <AccordionContent>
                Motelos es una plataforma informativa. No ofrecemos servicios de reserva directa. Te proporcionamos la
                información de contacto para que puedas comunicarte directamente con el motel de tu elección.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>¿Cómo puedo listar mi motel en Motelos?</AccordionTrigger>
              <AccordionContent>
                Si eres propietario de un motel y deseas aparecer en nuestra plataforma, por favor visita nuestra página
                de{" "}
                <a href="/contacto" className="text-purple-600 hover:underline">
                  Contacto
                </a>{" "}
                y envíanos un mensaje.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>¿Qué es un Telo / Albergue Transitorio?</AccordionTrigger>
              <AccordionContent>
                Los albergues transitorios (o "telos") son hoteles que ofrecen habitaciones por turnos de algunas horas
                o estadías nocturnas, enfocados en brindar privacidad y comodidad. Son ideales para parejas que buscan
                encuentros íntimos, viajeros que necesitan descanso, personas que quieren pasar una noche fuera de casa,
                o cualquiera que busque un espacio privado y discreto por unas horas.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </main>
      <Footer />
    </div>
  )
}
