import type { Meta, StoryObj } from "@storybook/react";
import { LoginForm } from "./LoginForm";

// Storybook configura a doc da história
const meta: Meta<typeof LoginForm> = {
  title: "Auth/LoginForm",        // Caminho do Storybook (pode ajustar como preferir)
  component: LoginForm,
  parameters: {
    layout: "fullscreen",         // Ocupa tela toda, igual login real
    docs: {
      description: {
        component: "Formulário de login do PWA Atendimento, com feedback de erro e loading.",
      },
    },
  },
};
export default meta;

// Aqui criamos uma 'história' padrão (você pode criar variações depois)
type Story = StoryObj<typeof LoginForm>;

export const Default: Story = {
  render: () => <LoginForm />,
  name: "Padrão",
};
