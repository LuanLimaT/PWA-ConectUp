"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useWebSocket } from "@/contexts/websocket-context"
import { Send, User, Headphones } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface ChatProps {
  atendimentoId: string
}

export function Chat({ atendimentoId }: ChatProps) {
  const [newMessage, setNewMessage] = useState("")
  const { messages, sendMessage, atendimentos } = useWebSocket()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const atendimento = atendimentos.find((a) => a.id === atendimentoId)
  const chatMessages = messages.filter((m) => m.atendimentoId === atendimentoId)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim()) {
      sendMessage(atendimentoId, newMessage.trim())
      setNewMessage("")
    }
  }

  if (!atendimento) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <p className="text-gray-500">Selecione um atendimento para começar</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>{atendimento.clientName}</span>
          </CardTitle>
          <Badge variant={atendimento.status === "active" ? "default" : "secondary"}>
            {atendimento.status === "active" ? "Ativo" : atendimento.status === "waiting" ? "Aguardando" : "Fechado"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatMessages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "agent" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === "agent" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
                }`}
              >
                <div className="flex items-center space-x-1 mb-1">
                  {message.sender === "agent" ? <Headphones className="h-3 w-3" /> : <User className="h-3 w-3" />}
                  <span className="text-xs opacity-75">
                    {message.sender === "agent" ? "Você" : atendimento.clientName}
                  </span>
                </div>
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-75 mt-1">{format(message.timestamp, "HH:mm", { locale: ptBR })}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t p-4">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="flex-1"
            />
            <Button type="submit" size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}
