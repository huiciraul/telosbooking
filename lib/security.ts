import type { NextRequest } from "next/server"

/**
 * Valida el token de autorización para webhooks
 * @param request - Request de Next.js
 * @returns true si el token es válido
 */
export function validateWebhookToken(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization")
  const expectedToken = process.env.N8N_WEBHOOK_TOKEN

  if (!expectedToken) {
    console.warn("⚠️ N8N_WEBHOOK_TOKEN no está configurado")
    return true // Permitir si no hay token configurado (para desarrollo)
  }

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false
  }

  const token = authHeader.substring(7) // Remover "Bearer "
  return token === expectedToken
}

// Modificar la función validateWebhookIP para que siempre retorne true si no hay IPs configuradas
export function validateWebhookIP(request: NextRequest): boolean {
  // Si no hay variable de entorno configurada, siempre permitir
  if (!process.env.ALLOWED_WEBHOOK_IPS) {
    return true
  }

  const allowedIPs = process.env.ALLOWED_WEBHOOK_IPS.split(",") || []

  if (allowedIPs.length === 0) {
    return true // Si no hay IPs configuradas, permitir todas
  }

  const clientIP =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown"

  return allowedIPs.some((ip) => clientIP.includes(ip.trim()))
}

/**
 * Rate limiting simple en memoria (para producción usar Redis)
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(identifier: string, maxRequests = 100, windowMs = 60000): boolean {
  const now = Date.now()
  const windowStart = now - windowMs

  const current = rateLimitMap.get(identifier)

  if (!current || current.resetTime < windowStart) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (current.count >= maxRequests) {
    return false
  }

  current.count++
  return true
}
