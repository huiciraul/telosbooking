import { PopularDestinations } from "@/components/sections/popular-destinations"
import { ResponsiveHeader } from "@/components/layout/responsive-header"
import { Footer } from "@/components/layout/footer"

export default function DestinosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <ResponsiveHeader />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Explora Nuestros Destinos</h1>
        <PopularDestinations />
      </main>
      <Footer />
    </div>
  )
}
