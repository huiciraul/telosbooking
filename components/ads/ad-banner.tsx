import { cn } from "@/lib/utils"

interface AdBannerProps {
  type: "horizontal" | "vertical" | "square"
  className?: string
}

export function AdBanner({ type, className }: AdBannerProps) {
  const dimensions = {
    horizontal: "h-24 w-full max-w-4xl", // 728x90
    vertical: "h-96 w-64", // 300x250
    square: "h-64 w-64", // 250x250
  }

  return (
    <div className={cn("mx-auto", className)}>
      <div
        className={cn(
          "bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center rounded-lg",
          dimensions[type],
        )}
      >
        <div className="text-center text-gray-500">
          <div className="text-sm font-medium">Espacio publicitario</div>
          <div className="text-xs">Google AdSense</div>
        </div>
      </div>
    </div>
  )
}
