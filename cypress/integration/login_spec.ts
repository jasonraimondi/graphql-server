describe("Login Page", () => {
  // beforeEach(() => {
  //   cy.request("DELETE", "http://localhost:8025/api/v1/messages");
  // });

  it("show invalid email message", () => {
    cy.visit("/login?redirectTo=/dashboard");
    cy.dataTest("login-form--email")
      .click()
      .type("jason4@raimondi")
      .contains("Invalid email");
  });

  it("login success", () => {
    cy.visit("/login?redirectTo=/dashboard");
    cy.dataTest("login-form--email")
      .click()
      .type("jason4@raimondi.us");
    cy.dataTest("login-form--password")
      .click()
      .type("jasonraimondi");
    cy.dataTest("login-form").submit();

    cy.location().should(loc => {
      expect(loc.href).to.eq("http://localhost:3000/dashboard");
    });
    cy.getCookie("jit").should("exist");
    cy.getCookie("jid").should("exist");
  });
});
