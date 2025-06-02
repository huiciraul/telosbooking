"use client"

import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { SearchForm } from "@/components/search-form"
import Image from "next/image"
import { FloatingActions } from "@/components/ui/floating-actions"

export function ResponsiveHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logo.png"
            alt="Motelo Logo"
            width={120} // Adjust width as needed
            height={36} // Adjust height as needed
            priority
          />
        </Link>

        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <SearchForm />
        </div>

        <nav className="hidden items-center gap-4 md:flex">
          <Link href="/como-funciona" className="text-sm font-medium hover:underline">
            Cómo Funciona
          </Link>
          <Link href="/destinos" className="text-sm font-medium hover:underline">
            Destinos
          </Link>
          <Link href="/contacto" className="text-sm font-medium hover:underline">
            Contacto
          </Link>
          <Link href="/servicios" className="text-sm font-medium hover:underline">
            Servicios
          </Link>
        </nav>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-4 p-4">
                <SearchForm />
                <Link href="/como-funciona" className="text-lg font-medium hover:underline">
                  Cómo Funciona
                </Link>
                <Link href="/destinos" className="text-lg font-medium hover:underline">
                  Destinos
                </Link>
                <Link href="/contacto" className="text-lg font-medium hover:underline">
                  Contacto
                </Link>
                <Link href="/servicios" className="text-lg font-medium hover:underline">
                  Servicios
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <FloatingActions />
    </header>
  )
}
