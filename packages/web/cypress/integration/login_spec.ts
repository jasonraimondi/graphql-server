describe("Login Page", () => {
  beforeEach(() => {
    cy.request("DELETE", "http://localhost:8025/api/v1/messages");
  });

  it("login", () => {
    cy.visit("http://localhost:3000/login?redirectTo=/dashboard");
    cy.get("#login-form--email")
      .click()
      .type("jason2@raimondi.us");
    cy.get("#login-form--password")
      .click()
      .type("jasonraimondi");

    cy.get("#login-form").submit();

    cy.location().should(loc => {
      expect(loc.href).to.eq("http://localhost:3000/dashboard");
    });
    cy.getCookie("jit").should("exist");
    cy.getCookie("jid").should("exist");
  });
});
