import { ResponsiveHeader } from "@/components/layout/responsive-header"
import { HeroSearch } from "@/components/search/hero-search"
import { QuickFilters } from "@/components/search/quick-filters"
import { FeaturesSection } from "@/components/sections/features-section"
import { PopularDestinations } from "@/components/sections/popular-destinations"
import { Footer } from "@/components/layout/footer"
import { FloatingActions } from "@/components/ui/floating-actions"
import { PopularTelosWrapper } from "@/components/sections/popular-telos-wrapper"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <ResponsiveHeader />

      <main>
        <HeroSearch />
        <QuickFilters />
        <PopularTelosWrapper />
        <FeaturesSection />
        <PopularDestinations />
      </main>

      <Footer />
      <FloatingActions />
    </div>
  )
}
