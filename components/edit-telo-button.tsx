"use client"

import Link from "next/link"
import { Button, type ButtonProps } from "@/components/ui/button"
import { Pencil } from "lucide-react"

interface EditTeloButtonProps extends ButtonProps {
  teloSlug: string
}

export function EditTeloButton({ teloSlug, variant = "outline", size = "sm", ...props }: EditTeloButtonProps) {
  const editHref = `/admin/telos/${teloSlug}/edit`

  return (
    <Button asChild variant={variant} size={size} {...props}>
      <Link href={editHref}>
        <Pencil className="mr-2 h-4 w-4" />
        Editar Telo
      </Link>
    </Button>
  )
}
