"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart, User, MapPin } from "lucide-react"

export function MobileHeader() {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 glass-effect border-b border-purple-100">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 gradient-primary rounded-xl flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent">
              Motelos
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="rounded-full">
              <Heart className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="rounded-full" onClick={() => setShowMenu(!showMenu)}>
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {showMenu && (
        <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={() => setShowMenu(false)}>
          <div className="absolute top-16 right-4 bg-white rounded-2xl shadow-xl p-4 min-w-48 animate-scale-in">
            <div className="space-y-2"></div>
          </div>
        </div>
      )}
    </>
  )
}
