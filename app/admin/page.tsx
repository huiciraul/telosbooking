"use client"

import { useEffect, useState } from "react"
import { WebhookStats } from "@/components/admin/webhook-stats"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Database, Webhook, BarChart3, MapPin, Star, TrendingUp } from "lucide-react"

interface Stats {
  total_telos: number
  total_ciudades: number
  telos_verificados: number
  rating_promedio: number
  telos_n8n: number
  total_busquedas: number
}

interface Ciudad {
  nombre: string
  busquedas: number
  total_telos: number
}

interface Telo {
  nombre: string
  rating: number
  ciudad: string
  precio: number
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [ciudadesPopulares, setCiudadesPopulares] = useState<Ciudad[]>([])
  const [telosTop, setTelosTop] = useState<Telo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/stats")
        if (response.ok) {
          const data = await response.json()
          setStats(data.stats)
          setCiudadesPopulares(data.ciudadesPopulares)
          setTelosTop(data.telosTop)
        }
      } catch (error) {
        console.error("Error fetching stats:", error)
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
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Administración</h1>
            <p className="text-gray-600">Cargando estadísticas...</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="h-16 bg-gray-100 animate-pulse rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Administración</h1>
          <p className="text-gray-600">Gestiona tu plataforma TelosBooking</p>
        </div>

        <div className="space-y-8">
          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="w-5 h-5" />
                  <span>Base de Datos</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">Inicializar la base de datos con datos de ejemplo</p>
                <Button asChild className="w-full">
                  <a href="/api/seed" target="_blank" rel="noreferrer">
                    Poblar BD
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Webhook className="w-5 h-5" />
                  <span>Webhook n8n</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">Verificar el estado del webhook de automatización</p>
                <Button asChild variant="outline" className="w-full">
                  <a href="/api/n8n/webhook" target="_blank" rel="noreferrer">
                    Ver Estado
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Estadísticas</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">Ver estadísticas completas del sistema</p>
                <Button asChild variant="outline" className="w-full">
                  <a href="/api/stats" target="_blank" rel="noreferrer">
                    Ver JSON
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Stats Overview */}
          {stats && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Telos</CardTitle>
                  <Database className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total_telos}</div>
                  <p className="text-xs text-muted-foreground">{stats.telos_n8n} desde n8n</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ciudades</CardTitle>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total_ciudades}</div>
                  <p className="text-xs text-muted-foreground">{stats.total_busquedas} búsquedas totales</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Verificados</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.telos_verificados}</div>
                  <p className="text-xs text-muted-foreground">
                    {((stats.telos_verificados / stats.total_telos) * 100).toFixed(1)}% del total
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Rating Promedio</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Number(stats.rating_promedio).toFixed(1)}</div>
                  <p className="text-xs text-muted-foreground">De 5.0 estrellas</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Top Lists */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Ciudades Populares */}
            <Card>
              <CardHeader>
                <CardTitle>Ciudades Más Buscadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {ciudadesPopulares.map((ciudad, index) => (
                    <div key={ciudad.nombre} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center">
                          {index + 1}
                        </Badge>
                        <div>
                          <p className="font-medium">{ciudad.nombre}</p>
                          <p className="text-sm text-gray-500">{ciudad.total_telos} telos</p>
                        </div>
                      </div>
                      <Badge variant="secondary">{ciudad.busquedas} búsquedas</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Telos Top */}
            <Card>
              <CardHeader>
                <CardTitle>Telos Mejor Valorados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {telosTop.map((telo, index) => (
                    <div key={telo.nombre} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center">
                          {index + 1}
                        </Badge>
                        <div>
                          <p className="font-medium">{telo.nombre}</p>
                          <p className="text-sm text-gray-500">
                            {telo.ciudad} - ${telo.precio}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-medium">{telo.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Webhook Statistics */}
          <WebhookStats />
        </div>
      </div>
    </div>
  )
}
