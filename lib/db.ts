import { neon } from "@neondatabase/serverless"

// Crear una conexión SQL reutilizable
let sqlClient: any = null

try {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL no está definida en las variables de entorno")
  }

  sqlClient = neon(process.env.DATABASE_URL)
  console.log("✅ Conexión a Neon PostgreSQL establecida")
} catch (error) {
  console.error("❌ Error inicializando conexión a Neon:", error)
  throw error
}

export const sql = sqlClient

// Función helper para ejecutar consultas SQL directas
export async function executeQuery<T = any>(query: string, params: any[] = []): Promise<T> {
  try {
    console.log(`🔍 Ejecutando consulta: ${query.slice(0, 100)}...`)
    const startTime = Date.now()

    const result = (await sql(query, params)) as T

    const duration = Date.now() - startTime
    console.log(`✅ Consulta completada en ${duration}ms`)

    return result
  } catch (error) {
    console.error(`❌ Error ejecutando consulta SQL:`, error)
    console.error(`📝 Query: ${query}`)
    console.error(`📝 Params:`, params)
    throw error
  }
}

// Función para verificar la conexión a la base de datos
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await executeQuery("SELECT 1")
    return true
  } catch (error) {
    console.error("❌ Error verificando conexión:", error)
    return false
  }
}
