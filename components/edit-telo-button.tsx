"use client"

import Link from "next/link"
import { Button, type ButtonProps } from "@/components/ui/button"
import { Pencil } from "lucide-react"

interface EditTeloButtonProps extends ButtonProps {
  teloSlug: string // Or just ID if slug is not used for edit path
  // You might want to pass the full telo object or just its ID/slug
}

export function EditTeloButton({ teloSlug, variant = "outline", size = "sm", ...props }: EditTeloButtonProps) {
  // Example: Link to an admin edit page. Adjust the href as needed.
  // This assumes an admin route like /admin/telos/[id]/edit
  const editHref = `/admin/telos/${teloSlug}/edit` // Or use telo.slug if preferred

  return (
    <Button asChild variant={variant} size={size} {...props}>
      <Link href={editHref}>
        <Pencil className="mr-2 h-4 w-4" />
        Editar Telo
      </Link>
    </Button>
  )
}
