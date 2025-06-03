"use client"

import { Button } from "@/components/ui/button"
import { MessageCircle, Phone } from "lucide-react"

interface FloatingActionsProps {
  telefono?: string | null
  showWhatsApp?: boolean
}

export function FloatingActions({ telefono, showWhatsApp = true }: FloatingActionsProps) {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      {/* WhatsApp - solo si showWhatsApp es true */}
      {showWhatsApp && (
        <Button
          size="lg"
          className="rounded-full shadow-lg bg-green-600 hover:bg-green-700 h-14 w-14"
          onClick={() => window.open("https://wa.me/5491234567890", "_blank")}
        >
          <MessageCircle className="h-6 w-6" />
          <span className="sr-only">WhatsApp</span>
        </Button>
      )}

      {/* Teléfono - solo si hay número específico */}
      {telefono && (
        <Button
          size="lg"
          variant="outline"
          className="rounded-full shadow-lg bg-white hover:bg-gray-50 h-14 w-14"
          onClick={() => window.open(`tel:${telefono}`, "_blank")}
        >
          <Phone className="h-6 w-6" />
          <span className="sr-only">Llamar</span>
        </Button>
      )}
    </div>
  )
}
