"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Database, Shield, Clock } from "lucide-react"

interface WebhookStats {
  status: string
  endpoint: string
  timestamp: string
  stats: {
    total_telos: number
    telos_n8n: number
    telos_verificados: number
    rating_promedio: number
  }
  security: {
    token_required: boolean
    ip_filtering: boolean
    rate_limiting: boolean
  }
}

export function WebhookStats() {
  const [stats, setStats] = useState<WebhookStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/n8n/webhook")
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error("Error fetching webhook stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
    // Actualizar cada 30 segundos
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="h-16 bg-gray-100 animate-pulse rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">No se pudieron cargar las estadísticas del webhook</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Estadísticas del Webhook</h2>
        <Badge variant={stats.status === "active" ? "default" : "destructive"}>
          {stats.status === "active" ? "Activo" : "Inactivo"}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Telos</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.stats.total_telos}</div>
            <p className="text-xs text-muted-foreground">{stats.stats.telos_n8n} desde n8n</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verificados</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.stats.telos_verificados}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.stats.telos_verificados / stats.stats.total_telos) * 100).toFixed(1)}% del total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating Promedio</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Number(stats.stats.rating_promedio).toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">De 5.0 estrellas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Última Actualización</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">{new Date(stats.timestamp).toLocaleTimeString()}</div>
            <p className="text-xs text-muted-foreground">{new Date(stats.timestamp).toLocaleDateString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Security Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Estado de Seguridad</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-3">
            <div className="flex items-center space-x-2">
              <Badge variant={stats.security.token_required ? "default" : "destructive"}>
                {stats.security.token_required ? "✓" : "✗"}
              </Badge>
              <span className="text-sm">Token requerido</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={stats.security.ip_filtering ? "default" : "secondary"}>
                {stats.security.ip_filtering ? "✓" : "○"}
              </Badge>
              <span className="text-sm">Filtrado de IP</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={stats.security.rate_limiting ? "default" : "destructive"}>
                {stats.security.rate_limiting ? "✓" : "✗"}
              </Badge>
              <span className="text-sm">Rate limiting</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Información del Endpoint</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <span className="text-sm font-medium">URL:</span>
              <code className="ml-2 text-sm bg-gray-100 px-2 py-1 rounded">{stats.endpoint}</code>
            </div>
            <div>
              <span className="text-sm font-medium">Método:</span>
              <code className="ml-2 text-sm bg-gray-100 px-2 py-1 rounded">POST</code>
            </div>
            <div>
              <span className="text-sm font-medium">Headers requeridos:</span>
              <code className="ml-2 text-sm bg-gray-100 px-2 py-1 rounded">Authorization: Bearer TOKEN</code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
