"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Search } from "lucide-react"
import Image from "next/image"

export function ResponsiveHeader() {
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 glass-effect border-b border-purple-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image src="/logo.png" alt="Motelo Logo" width={120} height={36} priority />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              <Link href="/telos" className="text-sm font-medium hover:text-purple-600 transition-colors">
                Explorar
              </Link>
              <Link href="/como-funciona" className="text-sm font-medium hover:text-purple-600 transition-colors">
                ¿Cómo funciona?
              </Link>
              <Link href="/contacto" className="text-sm font-medium hover:text-purple-600 transition-colors">
                Listar tu motel
              </Link>
            </nav>

            {/* Desktop Search */}
            <div className="hidden md:flex items-center space-x-3">
              <Button variant="ghost" size="sm" className="rounded-full">
                <Search className="w-4 h-4" />
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden items-center space-x-2">
              <Button variant="ghost" size="sm" className="rounded-full">
                <Search className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={() => setShowMobileMenu(false)}
        >
          <div className="absolute top-16 left-0 right-0 bg-white border-b border-purple-100 animate-fade-in">
            <div className="container mx-auto px-4 py-4 space-y-4">
              <Link
                href="/telos"
                className="block py-2 text-sm font-medium hover:text-purple-600"
                onClick={() => setShowMobileMenu(false)}
              >
                Explorar telos
              </Link>
              <Link
                href="/como-funciona"
                className="block py-2 text-sm font-medium hover:text-purple-600"
                onClick={() => setShowMobileMenu(false)}
              >
                ¿Cómo funciona?
              </Link>
              <Link
                href="/contacto"
                className="block py-2 text-sm font-medium hover:text-purple-600"
                onClick={() => setShowMobileMenu(false)}
              >
                Listar tu motel
              </Link>
              <hr className="my-2" />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
