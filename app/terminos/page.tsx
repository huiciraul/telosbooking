import { ResponsiveHeader } from "@/components/layout/responsive-header"
import { Footer } from "@/components/layout/footer"

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <ResponsiveHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto prose prose-purple">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">Términos de Uso</h1>
          <p className="text-lg text-gray-600 mb-8 text-center">Última actualización: 2 de junio de 2025</p>

          <h2>1. Aceptación de los Términos</h2>
          <p>
            Al acceder y utilizar el sitio web de Motelos (en adelante, "el Servicio"), usted acepta estar sujeto a
            estos Términos de Uso y a nuestra Política de Privacidad. Si no está de acuerdo con estos términos, no debe
            utilizar el Servicio.
          </p>

          <h2>2. Descripción del Servicio</h2>
          <p>
            Motelos es una plataforma informativa que proporciona detalles sobre moteles, telos, albergues y hoteles.
            Nuestro objetivo es ayudar a los usuarios a encontrar información relevante sobre estos establecimientos.
            Motelos no es una plataforma de reservas y no facilita transacciones directas entre usuarios y
            establecimientos.
          </p>

          <h2>3. Contenido del Usuario</h2>
          <p>
            Usted es responsable de cualquier contenido que publique en el Servicio. Motelos no se hace responsable de
            la exactitud, utilidad o seguridad de dicho contenido.
          </p>

          <h2>4. Limitación de Responsabilidad</h2>
          <p>
            Motelos no garantiza la exactitud, integridad o actualidad de la información proporcionada en el Servicio.
            La información se proporciona "tal cual" y sin garantías de ningún tipo. Motelos no será responsable de
            ningún daño directo, indirecto, incidental, especial o consecuente que resulte del uso o la imposibilidad de
            usar el Servicio.
          </p>

          <h2>5. Enlaces a Terceros</h2>
          <p>
            El Servicio puede contener enlaces a sitios web de terceros. Motelos no tiene control sobre el contenido o
            las prácticas de privacidad de estos sitios y no asume ninguna responsabilidad por ellos.
          </p>

          <h2>6. Cambios en los Términos</h2>
          <p>
            Motelos se reserva el derecho de modificar estos Términos de Uso en cualquier momento. Las modificaciones
            entrarán en vigor inmediatamente después de su publicación en el Servicio.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
