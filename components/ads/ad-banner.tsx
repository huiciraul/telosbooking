"use client"

import { useEffect } from "react"

interface AdBannerProps {
  slot: string
  format?: "auto" | "rectangle" | "vertical" | "horizontal"
  responsive?: boolean
  className?: string
}

export function AdBanner({ slot, format = "auto", responsive = true, className = "" }: AdBannerProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (err) {
      console.error("AdSense error:", err)
    }
  }, [])

  return (
    <div className={`ad-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-8114610675284168"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive.toString()}
      />
    </div>
  )
}

// Componentes específicos para diferentes tipos de anuncios
export function HeaderAd() {
  return (
    <div className="w-full bg-gray-50 py-2 border-b">
      <div className="container mx-auto px-4">
        <AdBanner
          slot="1234567890" // Reemplaza con tu slot ID real
          format="horizontal"
          className="text-center"
        />
      </div>
    </div>
  )
}

export function SidebarAd() {
  return (
    <div className="sticky top-20">
      <AdBanner
        slot="1234567891" // Reemplaza con tu slot ID real
        format="vertical"
        className="w-full max-w-xs"
      />
    </div>
  )
}

export function InContentAd() {
  return (
    <div className="my-8 py-4 bg-gray-50 rounded-lg">
      <AdBanner
        slot="1234567892" // Reemplaza con tu slot ID real
        format="rectangle"
        className="text-center"
      />
    </div>
  )
}

export function FooterAd() {
  return (
    <div className="w-full bg-gray-50 py-4 border-t">
      <div className="container mx-auto px-4">
        <AdBanner
          slot="1234567893" // Reemplaza con tu slot ID real
          format="horizontal"
          className="text-center"
        />
      </div>
    </div>
  )
}
