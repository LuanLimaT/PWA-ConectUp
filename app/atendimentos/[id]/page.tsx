"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useWebSocket } from "@/contexts/websocket-context"
import { Header } from "@/components/header"
import { Chat } from "@/components/chat"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface AtendimentoPageProps {
  params: {
    id: string
  }
}

export default function AtendimentoPage({ params }: AtendimentoPageProps) {
  const { user, isLoading } = useAuth()
  const { setActiveAtendimento, atendimentos } = useWebSocket()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
      return
    }

    if (params.id) {
      setActiveAtendimento(params.id)
    }
  }, [user, isLoading, router, params.id, setActiveAtendimento])

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

  const atendimento = atendimentos.find((a) => a.id === params.id)

  if (!atendimento) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Atendimento não encontrado</h2>
            <Button onClick={() => router.push("/atendimentos")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Atendimentos
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-6">
        <div className="mb-4">
          <Button variant="outline" onClick={() => router.push("/atendimentos")} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Atendimentos
          </Button>
        </div>

        <div className="h-[calc(100vh-200px)]">
          <Chat atendimentoId={params.id} />
        </div>
      </main>
    </div>
  )
}
