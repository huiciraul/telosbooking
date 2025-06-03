"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { User, Globe } from "lucide-react"

export function Header() {
  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Solo texto Poppins */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold font-poppins bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Motelo
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/telos" className="text-sm font-medium hover:text-purple-600 transition-colors">
              Telos
            </Link>
            <Link href="/experiencias" className="text-sm font-medium hover:text-purple-600 transition-colors">
              Experiencias
            </Link>
            <Link href="/servicios" className="text-sm font-medium hover:text-purple-600 transition-colors">
              Servicios
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="hidden md:flex">
              <Globe className="w-4 h-4 mr-2" />
              ES
            </Button>
            <Link href="/agregar-telo" className="text-sm font-medium hover:text-purple-600 transition-colors">
              Registrá tu telo
            </Link>
            <Button variant="outline" size="sm">
              <User className="w-4 h-4 mr-2" />
              Iniciar sesión
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
