import { ResponsiveHeader } from "@/components/layout/responsive-header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <ResponsiveHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Política de Privacidad</h1>
            <p className="text-lg text-gray-600">Última actualización: Enero 2024</p>
          </div>

          <Card>
            <CardContent className="p-8 prose prose-gray max-w-none">
              <h2>1. Información que Recopilamos</h2>
              <p>En TelosBooking, recopilamos información limitada para mejorar nuestro servicio:</p>
              <ul>
                <li>
                  <strong>Información de uso:</strong> Páginas visitadas, búsquedas realizadas, tiempo de navegación
                </li>
                <li>
                  <strong>Información técnica:</strong> Dirección IP, tipo de navegador, sistema operativo
                </li>
                <li>
                  <strong>Cookies:</strong> Para mejorar la experiencia del usuario y recordar preferencias
                </li>
              </ul>

              <h2>2. Cómo Utilizamos su Información</h2>
              <p>Utilizamos la información recopilada para:</p>
              <ul>
                <li>Proporcionar y mejorar nuestros servicios</li>
                <li>Personalizar la experiencia del usuario</li>
                <li>Analizar el uso del sitio web para mejoras</li>
                <li>Mantener la seguridad del sitio</li>
              </ul>

              <h2>3. Compartir Información</h2>
              <p>
                No vendemos, alquilamos ni compartimos su información personal con terceros, excepto en los siguientes
                casos:
              </p>
              <ul>
                <li>Cuando sea requerido por ley</li>
                <li>Para proteger nuestros derechos legales</li>
                <li>Con proveedores de servicios que nos ayudan a operar el sitio web</li>
              </ul>

              <h2>4. Cookies y Tecnologías Similares</h2>
              <p>Utilizamos cookies para mejorar su experiencia en nuestro sitio web. Las cookies nos ayudan a:</p>
              <ul>
                <li>Recordar sus preferencias de búsqueda</li>
                <li>Analizar el tráfico del sitio web</li>
                <li>Personalizar el contenido</li>
              </ul>
              <p>
                Puede configurar su navegador para rechazar cookies, pero esto puede afectar la funcionalidad del sitio.
              </p>

              <h2>5. Seguridad de los Datos</h2>
              <p>
                Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger su información
                personal contra acceso no autorizado, alteración, divulgación o destrucción.
              </p>

              <h2>6. Retención de Datos</h2>
              <p>
                Conservamos su información personal solo durante el tiempo necesario para cumplir con los propósitos
                descritos en esta política, a menos que la ley requiera un período de retención más largo.
              </p>

              <h2>7. Sus Derechos</h2>
              <p>Usted tiene derecho a:</p>
              <ul>
                <li>Acceder a su información personal</li>
                <li>Corregir información inexacta</li>
                <li>Solicitar la eliminación de su información</li>
                <li>Oponerse al procesamiento de su información</li>
                <li>Solicitar la portabilidad de sus datos</li>
              </ul>

              <h2>8. Enlaces a Sitios de Terceros</h2>
              <p>
                Nuestro sitio web puede contener enlaces a sitios web de terceros. No somos responsables de las
                prácticas de privacidad de estos sitios. Le recomendamos revisar las políticas de privacidad de
                cualquier sitio web que visite.
              </p>

              <h2>9. Cambios a esta Política</h2>
              <p>
                Podemos actualizar esta política de privacidad ocasionalmente. Le notificaremos sobre cambios
                significativos publicando la nueva política en nuestro sitio web.
              </p>

              <h2>10. Contacto</h2>
              <p>
                Si tiene preguntas sobre esta política de privacidad o sobre cómo manejamos su información personal,
                puede contactarnos en:
              </p>
              <ul>
                <li>Email: privacidad@telosbooking.com</li>
                <li>Dirección: Buenos Aires, Argentina</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
