"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { useWebSocket } from "@/contexts/websocket-context"
import { Header } from "@/components/header"
import { MessageSquare, Users, Clock, TrendingUp } from "lucide-react"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const { atendimentos } = useWebSocket()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const waitingCount = atendimentos.filter((a) => a.status === "waiting").length
  const activeCount = atendimentos.filter((a) => a.status === "active").length
  const totalCount = atendimentos.length
  const unreadCount = atendimentos.reduce((sum, a) => sum + a.unreadCount, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard de Atendimento</h1>
          <p className="text-gray-600">Bem-vindo de volta, {user.name}! Aqui está um resumo dos seus atendimentos.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Atendimentos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCount}</div>
              <p className="text-xs text-muted-foreground">Atendimentos ativos hoje</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aguardando Resposta</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{waitingCount}</div>
              <p className="text-xs text-muted-foreground">Clientes esperando</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Atendimentos Ativos</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeCount}</div>
              <p className="text-xs text-muted-foreground">Em andamento</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mensagens Não Lidas</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{unreadCount}</div>
              <p className="text-xs text-muted-foreground">Requerem atenção</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Atendimentos Recentes</CardTitle>
              <CardDescription>Últimos atendimentos que precisam de atenção</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {atendimentos.slice(0, 5).map((atendimento) => (
                  <div key={atendimento.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{atendimento.clientName}</p>
                      <p className="text-sm text-gray-500">{atendimento.lastMessage?.content.substring(0, 50)}...</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {atendimento.unreadCount > 0 && <Badge variant="destructive">{atendimento.unreadCount}</Badge>}
                      <Badge variant={atendimento.status === "waiting" ? "secondary" : "default"}>
                        {atendimento.status === "waiting" ? "Aguardando" : "Ativo"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
              <CardDescription>Acesse rapidamente as funcionalidades principais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start" onClick={() => router.push("/atendimentos")}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Ver Todos os Atendimentos
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  const waitingAtendimento = atendimentos.find((a) => a.status === "waiting")
                  if (waitingAtendimento) {
                    router.push(`/atendimentos/${waitingAtendimento.id}`)
                  }
                }}
                disabled={waitingCount === 0}
              >
                <Clock className="mr-2 h-4 w-4" />
                Próximo Atendimento ({waitingCount})
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  if ("serviceWorker" in navigator && "Notification" in window) {
                    Notification.requestPermission()
                  }
                }}
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Ativar Notificações
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
