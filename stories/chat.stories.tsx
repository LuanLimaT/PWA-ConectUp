import type { Meta, StoryObj } from "@storybook/react"
import { Chat } from "../components/chat"
import { AuthProvider } from "../contexts/auth-context"
import { WebSocketProvider } from "../contexts/websocket-context"

const meta: Meta<typeof Chat> = {
  title: "Components/Chat",
  component: Chat,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <AuthProvider>
        <WebSocketProvider>
          <div style={{ height: "600px", padding: "20px" }}>
            <Story />
          </div>
        </WebSocketProvider>
      </AuthProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    atendimentoId: "1",
  },
}

export const EmptyChat: Story = {
  args: {
    atendimentoId: "nonexistent",
  },
  parameters: {
    docs: {
      description: {
        story: "Estado do chat quando nenhum atendimento está selecionado",
      },
    },
  },
}
