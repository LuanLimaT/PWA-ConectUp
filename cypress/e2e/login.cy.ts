describe('LoginForm - PWA Atendimento', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login'); // Troque a URL se a rota for diferente!
  });

  it('Deve renderizar o formulário de login', () => {
    cy.contains('PWA Atendimento').should('be.visible');
    cy.get('input#username').should('be.visible');
    cy.get('input#password').should('be.visible');
    cy.get('button[type="submit"]').contains('Entrar').should('be.visible');
  });

  it('Não deve permitir submit com campos vazios', () => {
    cy.get('button[type="submit"]').click();
    // O HTML5 impede submit e exibe erro do navegador. 
    // Para checar no Cypress, pode usar:
    cy.get('input:invalid').should('have.length.at.least', 1);
  });

  it('Deve mostrar erro ao tentar login inválido', () => {
    cy.get('input#username').type('usuarioerrado');
    cy.get('input#password').type('senhaerrada');
    cy.get('button[type="submit"]').click();
    cy.contains('Credenciais inválidas').should('be.visible');
  });

  it('Deve logar com as credenciais de teste', () => {
    cy.get('input#username').type('OperadorMarcos');
    cy.get('input#password').type('12345');
    cy.get('button[type="submit"]').click();
    // Deve redirecionar para /dashboard
    cy.url({ timeout: 7000 }).should('include', '/dashboard');
  });
});
