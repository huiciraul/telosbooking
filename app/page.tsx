import { ResponsiveHeader } from "@/components/layout/responsive-header"
import { HeroSearch } from "@/components/search/hero-search"
import { QuickFilters } from "@/components/search/quick-filters"
import { PopularTelos } from "@/components/sections/popular-telos"
import { FeaturesSection } from "@/components/sections/features-section"
import { PopularDestinations } from "@/components/sections/popular-destinations"
import { Footer } from "@/components/layout/footer"
import { FloatingActions } from "@/components/ui/floating-actions"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <ResponsiveHeader />
      <div className="bg-gradient-to-br from-purple-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-center text-purple-800 py-8">
            Welcome to Our Travel Platform
          </h1>
        </div>
      </div>

      <main>
        <HeroSearch />
        <QuickFilters />
        <PopularTelos />
        <FeaturesSection />
        <PopularDestinations />
      </main>

      <Footer />
      <FloatingActions />
    </div>
  )
}
