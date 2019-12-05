describe("Login Page", () => {
  beforeEach(() => {
    cy.request("DELETE", "http://localhost:8025/api/v1/messages");
  });

  it("show invalid email message", () => {
    cy.visit("http://localhost:3000/login?redirectTo=/dashboard");
    cy.get("[data-test=email]")
      .click()
      .type("jason4@raimondi")
      .contains("Invalid email");
  });

  it("login success", () => {
    cy.visit("http://localhost:3000/login?redirectTo=/dashboard");
    cy.get("[data-test=email]")
      .click()
      .type("jason4@raimondi.us");
    cy.get("[data-test=password]")
      .click()
      .type("jasonraimondi");

    cy.get("[data-test=login-form]").submit();

    cy.location().should(loc => {
      expect(loc.href).to.eq("http://localhost:3000/dashboard");
    });
    cy.getCookie("jit").should("exist");
    cy.getCookie("jid").should("exist");
  });
});
