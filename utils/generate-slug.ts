/**
 * Genera un slug único a partir de un texto
 * @param text - Texto base para el slug
 * @param addTimestamp - Si agregar timestamp para unicidad
 * @returns Slug generado
 */
export function generateSlug(text: string, addTimestamp = false): string {
  let slug = text
    .toLowerCase()
    .normalize("NFD") // Normalizar caracteres acentuados
    .replace(/[\u0300-\u036f]/g, "") // Remover acentos
    .replace(/[^a-z0-9\s-]/g, "") // Solo letras, números, espacios y guiones
    .replace(/\s+/g, "-") // Espacios a guiones
    .replace(/-+/g, "-") // Múltiples guiones a uno solo
    .trim()

  if (addTimestamp) {
    slug += "-" + Date.now().toString().slice(-6)
  }

  return slug
}

/**
 * Valida si un slug es válido
 * @param slug - Slug a validar
 * @returns true si es válido
 */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9-]+$/.test(slug) && !slug.startsWith("-") && !slug.endsWith("-")
}
