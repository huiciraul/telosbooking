import { ResponsiveHeader } from "@/components/layout/responsive-header"
import { Footer } from "@/components/layout/footer"

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <ResponsiveHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto prose prose-purple">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">Política de Privacidad</h1>
          <p className="text-lg text-gray-600 mb-8 text-center">Última actualización: 2 de junio de 2025</p>

          <h2>1. Información que Recopilamos</h2>
          <p>Motelos recopila información para proporcionar y mejorar nuestros servicios. Esto incluye:</p>
          <ul>
            <li>
              **Información de uso**: Recopilamos información sobre cómo interactúa con nuestro Servicio, como las
              páginas visitadas, el tiempo de permanencia y las búsquedas realizadas.
            </li>
            <li>
              **Datos de ubicación**: Podemos recopilar datos de ubicación aproximada para mejorar los resultados de
              búsqueda relevantes.
            </li>
            <li>
              **Cookies y tecnologías similares**: Utilizamos cookies para mejorar su experiencia, analizar el tráfico y
              personalizar el contenido y los anuncios.
            </li>
          </ul>

          <h2>2. Cómo Utilizamos la Información</h2>
          <p>Utilizamos la información recopilada para:</p>
          <ul>
            <li>Operar y mantener el Servicio.</li>
            <li>Mejorar y personalizar su experiencia.</li>
            <li>Analizar el uso del Servicio para optimizar el rendimiento y el contenido.</li>
            <li>Mostrar anuncios relevantes a través de plataformas como Google AdSense.</li>
          </ul>

          <h2>3. Compartir Información</h2>
          <p>No compartimos su información personal con terceros, excepto en las siguientes circunstancias:</p>
          <ul>
            <li>
              Con proveedores de servicios que nos ayudan a operar el Servicio (por ejemplo, alojamiento, análisis).
            </li>
            <li>Para cumplir con obligaciones legales.</li>
            <li>Con su consentimiento.</li>
          </ul>

          <h2>4. Google AdSense</h2>
          <p>
            Motelos utiliza Google AdSense para mostrar anuncios. Google utiliza cookies para mostrar anuncios basados
            en sus visitas anteriores a nuestro sitio web y otros sitios. Puede optar por no participar en la publicidad
            personalizada visitando la Configuración de anuncios de Google.
          </p>

          <h2>5. Sus Derechos</h2>
          <p>
            Usted tiene derecho a acceder, corregir o eliminar su información personal. Para ejercer estos derechos,
            contáctenos a través de la página de{" "}
            <a href="/contacto" className="text-purple-600 hover:underline">
              Contacto
            </a>
            .
          </p>

          <h2>6. Cambios en esta Política</h2>
          <p>
            Podemos actualizar nuestra Política de Privacidad ocasionalmente. Le notificaremos cualquier cambio
            publicando la nueva Política de Privacidad en esta página.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
