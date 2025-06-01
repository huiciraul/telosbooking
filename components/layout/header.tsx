"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin, User, Globe } from "lucide-react"

export function Header() {
  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-blue-600">TelosBooking</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/telos" className="text-sm font-medium hover:text-blue-600">
              Telos
            </Link>
            <Link href="/experiencias" className="text-sm font-medium hover:text-blue-600">
              Experiencias
            </Link>
            <Link href="/servicios" className="text-sm font-medium hover:text-blue-600">
              Servicios
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="hidden md:flex">
              <Globe className="w-4 h-4 mr-2" />
              ES
            </Button>
            <Link href="/agregar-telo" className="text-sm font-medium hover:text-blue-600">
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
