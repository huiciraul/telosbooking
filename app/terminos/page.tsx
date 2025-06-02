import { ResponsiveHeader } from "@/components/layout/responsive-header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <ResponsiveHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Términos y Condiciones</h1>
            <p className="text-lg text-gray-600">Última actualización: Enero 2024</p>
          </div>

          <Card>
            <CardContent className="p-8 prose prose-gray max-w-none">
              <h2>1. Aceptación de los Términos</h2>
              <p>
                Al acceder y utilizar TelosBooking, usted acepta estar sujeto a estos términos y condiciones de uso. Si
                no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestro servicio.
              </p>

              <h2>2. Descripción del Servicio</h2>
              <p>
                TelosBooking es una plataforma de información que permite a los usuarios buscar y encontrar información
                sobre albergues transitorios y telos en Argentina. No somos propietarios ni operamos ninguno de los
                establecimientos listados.
              </p>

              <h2>3. Uso del Servicio</h2>
              <p>Usted se compromete a:</p>
              <ul>
                <li>Utilizar el servicio solo para fines legales</li>
                <li>No interferir con el funcionamiento del sitio web</li>
                <li>No intentar acceder a áreas restringidas del sistema</li>
                <li>Proporcionar información veraz cuando sea requerida</li>
              </ul>

              <h2>4. Información y Disponibilidad</h2>
              <p>
                La información sobre precios, servicios y disponibilidad se proporciona con fines informativos.
                TelosBooking no garantiza la exactitud, completitud o actualidad de esta información. Los usuarios deben
                confirmar todos los detalles directamente con los establecimientos.
              </p>

              <h2>5. Reservas y Pagos</h2>
              <p>
                TelosBooking no procesa reservas ni pagos. Todas las transacciones se realizan directamente entre el
                usuario y el establecimiento. No somos responsables de disputas relacionadas con reservas o pagos.
              </p>

              <h2>6. Limitación de Responsabilidad</h2>
              <p>
                TelosBooking no será responsable por daños directos, indirectos, incidentales o consecuentes que
                resulten del uso de nuestro servicio. Esto incluye, pero no se limita a, pérdidas de ganancias, datos o
                uso.
              </p>

              <h2>7. Privacidad</h2>
              <p>
                Su privacidad es importante para nosotros. Consulte nuestra Política de Privacidad para obtener
                información sobre cómo recopilamos, utilizamos y protegemos su información personal.
              </p>

              <h2>8. Modificaciones</h2>
              <p>
                Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones entrarán
                en vigor inmediatamente después de su publicación en el sitio web.
              </p>

              <h2>9. Ley Aplicable</h2>
              <p>
                Estos términos se rigen por las leyes de la República Argentina. Cualquier disputa será resuelta en los
                tribunales competentes de Buenos Aires, Argentina.
              </p>

              <h2>10. Contacto</h2>
              <p>Si tiene preguntas sobre estos términos y condiciones, puede contactarnos en: info@telosbooking.com</p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
