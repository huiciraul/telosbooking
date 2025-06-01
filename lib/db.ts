import { neon } from "@neondatabase/serverless"

// Crear una conexión SQL reutilizable
let sqlClient: any = null
let dbInitError: Error | null = null

try {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL no está definida en las variables de entorno")
  }
  sqlClient = neon(process.env.DATABASE_URL)
  console.log("✅ Conexión a Neon PostgreSQL establecida")
} catch (error: any) {
  console.error("❌ Error inicializando conexión a Neon:", error)
  dbInitError = error
}

export const sql = sqlClient

export async function executeQuery<T = any>(query: string, params: any[] = []): Promise<T[]> {
  if (dbInitError) {
    console.error("❌ executeQuery: DB initialization failed. Throwing stored error.")
    throw dbInitError
  }
  if (!sqlClient) {
    console.error("❌ executeQuery: sqlClient is null/undefined. This should not happen if dbInitError is null.")
    throw new Error("Database client not available after initialization.")
  }

  try {
    console.log(`🔍 Ejecutando consulta: ${query.slice(0, 100)}...`)
    const startTime = Date.now()

    // CORRECCIÓN: Usar sqlClient.query() para consultas parametrizadas
    const result = await sqlClient.query(query, params)

    const duration = Date.now() - startTime
    console.log(`✅ Consulta completada en ${duration}ms`)

    if (!Array.isArray(result)) {
      console.error("❌ Unexpected non-array result from Neon query:", result)
      throw new Error("Database query returned an unexpected non-array format.")
    }

    return result as T[]
  } catch (error: any) {
    console.error(`❌ Error ejecutando consulta SQL:`, error)
    console.error(`📝 Query: ${query}`)
    console.error(`📝 Params:`, params)
    throw error instanceof Error ? error : new Error(String(error))
  }
}

export async function checkDatabaseConnection(): Promise<boolean> {
  if (dbInitError) {
    console.error("❌ checkDatabaseConnection: DB initialization failed, returning false.")
    return false
  }
  if (!sqlClient) {
    console.error("❌ checkDatabaseConnection: sqlClient is null/undefined, returning false.")
    return false
  }
  try {
    // CORRECCIÓN: Usar sqlClient.query() para la verificación
    await sqlClient.query("SELECT 1")
    return true
  } catch (error) {
    console.error("❌ Error verificando conexión:", error)
    return false
  }
}
