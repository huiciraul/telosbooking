"use client"

import dynamic from "next/dynamic"
import { Suspense } from "react"

const TelosMap = dynamic(() => import("./telos-map"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
      <div className="text-center">
        <div className="w-8 h-8 mx-auto mb-2 border-2 border-purple-600 rounded-full border-t-transparent animate-spin"></div>
        <p className="text-sm text-gray-600">Cargando mapa...</p>
      </div>
    </div>
  ),
})

interface TelosMapWrapperProps {
  telos?: any[]
  telo?: any
}

export function TelosMapWrapper({ telos, telo }: TelosMapWrapperProps) {
  // Asegurar que siempre tenemos un array de telos
  const telosArray = telos || (telo ? [telo] : [])

  return (
    <Suspense fallback={<div className="h-full bg-gray-100 rounded-lg animate-pulse" />}>
      <TelosMap telos={telosArray} />
    </Suspense>
  )
}
