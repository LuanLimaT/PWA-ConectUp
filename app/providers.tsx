"use client"

import type React from "react"

import { AuthProvider } from "@/contexts/auth-context"
import { WebSocketProvider } from "@/contexts/websocket-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <WebSocketProvider>{children}</WebSocketProvider>
    </AuthProvider>
  )
}
