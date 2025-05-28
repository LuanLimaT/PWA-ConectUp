"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useWebSocket } from "@/contexts/websocket-context"
import { Header } from "@/components/header"
import { AtendimentoCard } from "@/components/atendimento-card"
import { Chat } from "@/components/chat"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"

export default function AtendimentosPage() {
  const { user, isLoading } = useAuth()
  const { atendimentos, activeAtendimento, setActiveAtendimento } = useWebSocket()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "waiting" | "active" | "closed">("all")

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

  const filteredAtendimentos = atendimentos.filter((atendimento) => {
    const matchesSearch = atendimento.clientName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || atendimento.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
          {/* Lista de Atendimentos */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Atendimentos</h2>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">{filteredAtendimentos.length} total</Badge>
              </div>
            </div>

            {/* Filtros */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nome do cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex space-x-2">
                <Button
                  variant={statusFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("all")}
                >
                  Todos
                </Button>
                <Button
                  variant={statusFilter === "waiting" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("waiting")}
                >
                  Aguardando
                </Button>
                <Button
                  variant={statusFilter === "active" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("active")}
                >
                  Ativos
                </Button>
              </div>
            </div>

            {/* Lista */}
            <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-300px)]">
              {filteredAtendimentos.map((atendimento) => (
                <AtendimentoCard
                  key={atendimento.id}
                  atendimento={atendimento}
                  isActive={activeAtendimento === atendimento.id}
                  onClick={() => setActiveAtendimento(atendimento.id)}
                />
              ))}

              {filteredAtendimentos.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>Nenhum atendimento encontrado</p>
                </div>
              )}
            </div>
          </div>

          {/* Chat */}
          <div className="lg:col-span-2">
            {activeAtendimento ? (
              <Chat atendimentoId={activeAtendimento} />
            ) : (
              <div className="h-full flex items-center justify-center bg-white rounded-lg border">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                    <Search className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Selecione um atendimento</h3>
                  <p className="text-gray-500">Escolha um atendimento da lista para começar a conversar</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
