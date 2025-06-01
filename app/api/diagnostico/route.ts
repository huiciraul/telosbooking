import { NextResponse } from "next/server"
import { executeQuery, checkDatabaseConnection } from "@/lib/db"

export async function GET() {
  const diagnostico = {
    timestamp: new Date().toISOString(),
    database: {
      connected: false,
      connection_string: process.env.DATABASE_URL
        ? `${process.env.DATABASE_URL.split("@")[0].slice(0, 15)}...`
        : "No configurada",
      tables: {
        ciudades: 0,
        telos: 0,
      },
      error: null as string | null,
    },
    environment: {
      hasWebhookUrl: !!process.env.N8N_WEBHOOK_URL,
      hasWebhookToken: !!process.env.N8N_WEBHOOK_TOKEN,
      webhookUrl: process.env.N8N_WEBHOOK_URL || "No configurado",
      nodeEnv: process.env.NODE_ENV || "development",
      vercelEnv: process.env.VERCEL_ENV || "development",
    },
    api: {
      endpoints: ["/api/telos", "/api/ciudades", "/api/n8n/webhook", "/api/seed", "/api/test-scraping"],
    },
  }

  try {
    diagnostico.database.connected = await checkDatabaseConnection()

    if (diagnostico.database.connected) {
      try {
        const ciudadesCountResult = await executeQuery<{ count: string }>("SELECT COUNT(*) as count FROM ciudades")
        const telosCountResult = await executeQuery<{ count: string }>(
          "SELECT COUNT(*) as count FROM telos WHERE activo = true",
        )

        diagnostico.database.tables.ciudades = Number.parseInt(ciudadesCountResult[0]?.count || "0", 10)
        diagnostico.database.tables.telos = Number.parseInt(telosCountResult[0]?.count || "0", 10)
      } catch (error: any) {
        diagnostico.database.error = error instanceof Error ? error.message : String(error)
        console.error("❌ Error counting records in diagnostico:", error)
      }
    } else {
      if (!diagnostico.database.error) {
        diagnostico.database.error =
          "No se pudo conectar a la base de datos. Verifique DATABASE_URL y el estado de su instancia Neon."
      }
    }
  } catch (error: any) {
    console.error("❌ Error general en diagnóstico de BD:", error)
    diagnostico.database.connected = false
    diagnostico.database.error = error instanceof Error ? error.message : String(error)
  }

  return NextResponse.json(diagnostico)
}
