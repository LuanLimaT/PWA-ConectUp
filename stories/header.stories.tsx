import type { Meta, StoryObj } from "@storybook/react"
import { Header } from "../components/header"
import { AuthProvider } from "../contexts/auth-context"
import { WebSocketProvider } from "../contexts/websocket-context"

const meta: Meta<typeof Header> = {
  title: "Components/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <AuthProvider>
        <WebSocketProvider>
          <Story />
        </WebSocketProvider>
      </AuthProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithNotifications: Story = {
  parameters: {
    docs: {
      description: {
        story: "Header com notificações de atendimentos pendentes",
      },
    },
  },
}
