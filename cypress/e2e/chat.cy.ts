describe('Chat de Atendimento', () => {
  beforeEach(() => {
    // 1. Faz login antes de qualquer teste
    cy.visit('http://localhost:3000/login');
    cy.get('input#username').type('OperadorMarcos');
    cy.get('input#password').type('12345');
    cy.get('button[type="submit"]').click();

    // 2. Aguarda ser redirecionado para dashboard ou rota autenticada
    cy.url().should('include', '/dashboard');

    // 3. Vai para tela de atendimentos
    cy.visit('http://localhost:3000/atendimentos');
  });

  it('Deve mostrar aviso se nenhum atendimento estiver selecionado', () => {
    // Verifica se o painel direito mostra o aviso
    cy.contains('Selecione um atendimento para começar').should('be.visible');
  });

  it('Deve abrir um atendimento ao clicar no card e permitir enviar mensagem', () => {
    // Clique no primeiro atendimento da lista (ajuste o seletor conforme necessário)
    cy.contains('Visitante').first().click();

    // Agora o painel deve exibir o chat do atendimento selecionado
    cy.get('input[placeholder="Digite sua mensagem..."]')
      .should('be.visible')
      .type('Mensagem Cypress');

    cy.get('button[type="submit"]').click();

    // A mensagem enviada deve aparecer no painel direito
    cy.contains('Mensagem Cypress').should('exist');

    // Valida que o nome do cliente está presente no topo do painel
    cy.get('.flex.items-center.space-x-2').should('contain.text', 'Visitante');
  });
});
