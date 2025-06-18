"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Clock } from "lucide-react"
import { format, formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

interface Atendimento {
  id: string
  clientName: string
  status: "waiting" | "active" | "closed"
  lastMessage?: {
    content: string
    timestamp: string | Date
    sender: "client" | "agent"
  }
  unreadCount: number
  startedAt: string | Date
}

interface AtendimentoCardProps {
  atendimento: Atendimento
  isActive?: boolean
  onClick: () => void
}

export function AtendimentoCard({ atendimento, isActive, onClick }: AtendimentoCardProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "waiting":
        return "bg-yellow-100 text-yellow-800"
      case "active":
        return "bg-green-100 text-green-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "waiting":
        return "Aguardando"
      case "active":
        return "Ativo"
      case "closed":
        return "Fechado"
      default:
        return "Desconhecido"
    }
  }

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${isActive ? "ring-2 ring-blue-500 bg-blue-50" : ""}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-gray-500" />
            <h3 className="font-medium text-sm">{atendimento.clientName}</h3>
          </div>
          <div className="flex items-center space-x-2">
            {atendimento.unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {atendimento.unreadCount}
              </Badge>
            )}
            <Badge className={`text-xs ${getStatusColor(atendimento.status)}`} variant="secondary">
              {getStatusText(atendimento.status)}
            </Badge>
          </div>
        </div>

        {atendimento.lastMessage && (
          <div className="mb-2">
            <p className="text-sm text-gray-600 line-clamp-2">
              {atendimento.lastMessage.sender === "agent" ? "Você: " : ""}
              {atendimento.lastMessage.content}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>
              {mounted && atendimento.startedAt
                ? formatDistanceToNow(new Date(atendimento.startedAt), {
                    addSuffix: true,
                    locale: ptBR,
                  })
                : "—"}
            </span>
          </div>
          {mounted && atendimento.lastMessage?.timestamp && (
            <span>
              {format(new Date(atendimento.lastMessage.timestamp), "HH:mm", {
                locale: ptBR,
              })}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
