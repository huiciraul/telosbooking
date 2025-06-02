import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="border-t bg-gray-100 py-8">
      <div className="container grid grid-cols-1 gap-8 md:grid-cols-4">
        <div className="space-y-4">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo.png"
              alt="Motelo Logo"
              width={120} // Adjust width as needed
              height={36} // Adjust height as needed
              priority
            />
          </Link>
          <p className="text-sm text-gray-600">
            Tu guía definitiva para encontrar los mejores albergues transitorios y telos en Argentina.
          </p>
          <div className="flex space-x-4">
            <Link href="#" className="text-gray-600 hover:text-gray-900">
              <Facebook className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900">
              <Instagram className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900">
              <Twitter className="h-5 w-5" />
            </Link>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Navegación</h3>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>
              <Link href="/como-funciona" className="hover:underline">
                Cómo Funciona
              </Link>
            </li>
            <li>
              <Link href="/destinos" className="hover:underline">
                Destinos
              </Link>
            </li>
            <li>
              <Link href="/servicios" className="hover:underline">
                Servicios
              </Link>
            </li>
            <li>
              <Link href="/experiencias" className="hover:underline">
                Experiencias
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Legal</h3>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>
              <Link href="/terminos" className="hover:underline">
                Términos y Condiciones
              </Link>
            </li>
            <li>
              <Link href="/privacidad" className="hover:underline">
                Política de Privacidad
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Ayuda</h3>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>
              <Link href="/ayuda" className="hover:underline">
                Preguntas Frecuentes
              </Link>
            </li>
            <li>
              <Link href="/contacto" className="hover:underline">
                Contacto
              </Link>
            </li>
            <li>
              <Link href="/contacto#listar-motel" className="hover:underline">
                Listar tu Motel
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-8 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Motelos. Todos los derechos reservados.
      </div>
    </footer>
  )
}
