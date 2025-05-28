"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { useWebSocket } from "@/contexts/websocket-context"
import { MessageSquare, LogOut, Wifi, WifiOff } from "lucide-react"

export function Header() {
  const { user, logout } = useAuth()
  const { isConnected, atendimentos } = useWebSocket()

  const waitingCount = atendimentos.filter((a) => a.status === "waiting").length
  const activeCount = atendimentos.filter((a) => a.status === "active").length

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-semibold">PWA Atendimento</h1>
          </div>

          <div className="flex items-center space-x-2">
            {isConnected ? <Wifi className="h-4 w-4 text-green-500" /> : <WifiOff className="h-4 w-4 text-red-500" />}
            <span className="text-sm text-gray-500">{isConnected ? "Conectado" : "Desconectado"}</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">Aguardando: {waitingCount}</Badge>
            <Badge variant="default">Ativos: {activeCount}</Badge>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Olá, {user?.name}</span>
            <Button variant="outline" size="sm" onClick={logout} className="flex items-center space-x-1">
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
