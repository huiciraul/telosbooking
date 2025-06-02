import { cn } from "@/lib/utils"
import type React from "react"

interface ShellProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  layout?: "default" | "dashboard" | "auth" | "simple"
}

export function Shell({ children, layout = "default", className, ...props }: ShellProps) {
  return (
    <section
      className={cn(
        "grid items-center gap-8 pb-8 pt-6 md:py-8",
        layout === "default" && "container",
        layout === "dashboard" && "container flex-1 gap-12 rounded-lg border border-dashed shadow-sm",
        layout === "auth" && "flex h-screen items-center justify-center",
        className,
      )}
      {...props}
    >
      {children}
    </section>
  )
}
