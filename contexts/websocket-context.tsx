"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useAuth } from "./auth-context"
import { io, type Socket } from "socket.io-client"

interface Message {
  id: string
  atendimentoId: string
  sender: "client" | "agent"
  content: string
  timestamp: Date
  clientName?: string
}

interface Atendimento {
  id: string
  clientName: string
  status: "waiting" | "active" | "closed"
  lastMessage?: Message
  unreadCount: number
  startedAt: Date
}

interface WebSocketContextType {
  messages: Message[]
  atendimentos: Atendimento[]
  sendMessage: (atendimentoId: string, content: string) => void
  isConnected: boolean
  activeAtendimento: string | null
  setActiveAtendimento: (id: string | null) => void
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined)

// URL do servidor Socket.IO - substitua pela URL do seu servidor
const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "http://localhost:3002"

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [socket, setSocket] = useState<Socket | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [activeAtendimento, setActiveAtendimento] = useState<string | null>(null)

  // Conectar ao Socket.IO quando o usuário estiver autenticado
  useEffect(() => {
    if (!user) return

    // Inicializar conexão Socket.IO
    const socketInstance = io(SOCKET_SERVER_URL, {
      auth: {
        token: user.id, // Pode ser substituído por um token JWT real
        username: user.username,
      },
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ["websocket", "polling"],
    })

    // Configurar event listeners
    socketInstance.on("connect", () => {
      console.log("Conectado ao servidor Socket.IO")
      setIsConnected(true)

      // Solicitar dados iniciais
      socketInstance.emit("agent:join", { agentId: user.id })
    })

    socketInstance.on("disconnect", () => {
      console.log("Desconectado do servidor Socket.IO")
      setIsConnected(false)
    })

    socketInstance.on("connect_error", (error) => {
      console.error("Erro de conexão:", error)
      setIsConnected(false)
    })

    // Receber lista inicial de atendimentos
    socketInstance.on("atendimentos:list", (data: Atendimento[]) => {
      setAtendimentos(data)
    })

    // Receber mensagens de um atendimento específico
    socketInstance.on("atendimento:messages", (data: { atendimentoId: string; messages: Message[] }) => {
      setMessages((prevMessages) => {
        // Filtrar mensagens antigas deste atendimento
        const filteredMessages = prevMessages.filter((m) => m.atendimentoId !== data.atendimentoId)
        // Adicionar novas mensagens
        return [...filteredMessages, ...data.messages]
      })
    })

    // Receber nova mensagem
    socketInstance.on("message:new", (message: Message) => {
      // Adicionar mensagem à lista
      setMessages((prev) => [...prev, message])

      // Atualizar o atendimento correspondente
      setAtendimentos((prev) =>
        prev.map((atendimento) =>
          atendimento.id === message.atendimentoId
            ? {
                ...atendimento,
                lastMessage: message,
                unreadCount: message.sender === "client" ? atendimento.unreadCount + 1 : atendimento.unreadCount,
                status: message.sender === "client" ? "waiting" : "active",
              }
            : atendimento,
        ),
      )

      // Mostrar notificação se a mensagem for de um cliente
      if (message.sender === "client" && "serviceWorker" in navigator && "Notification" in window) {
        if (Notification.permission === "granted") {
          new Notification("Nova mensagem", {
            body: `${message.clientName || "Cliente"}: ${message.content}`,
            icon: "/icons/icon-192x192.png",
          })
        }
      }
    })

    // Novo atendimento criado
    socketInstance.on("atendimento:new", (atendimento: Atendimento) => {
      setAtendimentos((prev) => [...prev, atendimento])
    })

    // Atendimento atualizado
    socketInstance.on("atendimento:updated", (atendimento: Atendimento) => {
      setAtendimentos((prev) => prev.map((a) => (a.id === atendimento.id ? atendimento : a)))
    })

    setSocket(socketInstance)

    // Cleanup na desmontagem
    return () => {
      socketInstance.off("connect")
      socketInstance.off("disconnect")
      socketInstance.off("atendimentos:list")
      socketInstance.off("atendimento:messages")
      socketInstance.off("message:new")
      socketInstance.off("atendimento:new")
      socketInstance.off("atendimento:updated")
      socketInstance.disconnect()
    }
  }, [user])

  // Carregar mensagens de um atendimento quando ele for selecionado
  useEffect(() => {
    if (socket && activeAtendimento) {
      socket.emit("atendimento:join", { atendimentoId: activeAtendimento })

      // Marcar como lido
      setAtendimentos((prev) => prev.map((a) => (a.id === activeAtendimento ? { ...a, unreadCount: 0 } : a)))
    }
  }, [socket, activeAtendimento])

  // Função para enviar mensagem
  const sendMessage = (atendimentoId: string, content: string) => {
    if (!socket || !user) return

    const messageData = {
      atendimentoId,
      content,
      sender: "agent",
      agentId: user.id,
      agentName: user.name,
    }

    socket.emit("message:send", messageData)
  }

  return (
    <WebSocketContext.Provider
      value={{
        messages,
        atendimentos,
        sendMessage,
        isConnected,
        activeAtendimento,
        setActiveAtendimento,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  )
}

export function useWebSocket() {
  const context = useContext(WebSocketContext)
  if (context === undefined) {
    throw new Error("useWebSocket must be used within a WebSocketProvider")
  }
  return context
}
