describe('alura busca cursos', () => {

    beforeEach(() => {
        cy.visit('/');

        cy.intercept('POST', 'https://apialurapic.herokuapp.com/user/login', {
            statusCode: 400
        }).as('stubPost')
    })

    it('Verifica mensagens de validacao', () => {
        cy.contains('a','Register now').click();
        cy.contains('button','Register').click();
        cy.contains('ap-vmessage', 'Email is required!').should('be.visible');
        cy.contains('button','Register').click();
        cy.contains('ap-vmessage', 'User name is required!').should('be.visible');
        cy.contains('ap-vmessage', 'Password is required!').should('be.visible');
        cy.contains('ap-vmessage', 'Full name is required!').should('be.visible');
    })

    it('Verifica mensagem de email invalido', () => {
        cy.contains('a','Register now').click();
        cy.get('input[formcontrolname="email"]').type('leonardo');
        cy.contains('button','Register').click();
        cy.contains('ap-vmessage', 'Invalid e-mail').should('be.visible');
    })

    it('Verifica mensagem de senha com menos de 8 caracteres', () => {
        cy.contains('a','Register now').click();
        cy.get('input[formcontrolname="password"]').type('leo');
        cy.contains('button','Register').click();
        cy.contains('ap-vmessage', 'Mininum length is 8').should('be.visible');
    })

    it('Verifica mensagem de nome de usuario em caixa baixa', () => {
        cy.contains('a','Register now').click();
        cy.get('input[formcontrolname="userName"]').type('Leo');
        cy.contains('button','Register').click();
        cy.contains('ap-vmessage', 'Must be lower case').should('be.visible');
    })

    it.only('fazer login de usuario valido',()=>{
        cy.login(Cypress.env('userName'), Cypress.env('password'))
        cy.wait('@stubPost')
        cy.contains('a','(Logout)').should('be.visible');
    })

    it('fazer login de usuario invalido',()=>{
        cy.login('leleo', '1234')
        cy.on('window:alert',(str)=>{
            expect(str).to.equal('Invalid user name or password')
        })
    })

    const usuarios = require('../../fixtures/usuarios.json')
    usuarios.forEach(usuario => {
        it(`Verifica cadastro valido ${usuario.userName} `, () => {
            cy.cadastro(usuario.email, usuario.fullName, 
            usuario.userName, usuario.password)
        })
    });
})