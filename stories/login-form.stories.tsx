import type { Meta, StoryObj } from "@storybook/react"
import { LoginForm } from "../components/login-form"
import { AuthProvider } from "../contexts/auth-context"

const meta: Meta<typeof LoginForm> = {
  title: "Components/LoginForm",
  component: LoginForm,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <AuthProvider>
        <Story />
      </AuthProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithError: Story = {
  parameters: {
    docs: {
      description: {
        story: "Estado do formulário quando há erro de autenticação",
      },
    },
  },
}
