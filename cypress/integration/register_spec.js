describe("Register Page", () => {
  const email = cy.faker.internet.email();
  const first = cy.faker.name.firstName();
  const last = cy.faker.name.lastName();
  const password = cy.faker.internet.password();

  it("register", () => {
    cy.register({ email, first, last, password });
  });

  it("shows user is not active", () => {
    cy.visit("/login?redirectTo=/dashboard");
    cy.dataTest("login-form--email")
      .click()
      .type(email);
    cy.dataTest("login-form--password")
      .click()
      .type(password);
    cy.dataTest("login-form").submit();

    cy.contains("user is not active");
  });

  it("validate user email", () => {
    cy.verifyUser(email)
  });

  it("user can log in", () => {
    cy.login({ email, password });
  });

  it("user can log out", () => {
    cy.login({ email, password });

    cy.dataTest("logout-link").click();

    cy.location().should(loc => {
      expect(loc.pathname).to.eq("/login");
    });
    cy.getCookie("jit").should("not.exist");
    cy.getCookie("jid").should("have.property", "value", "");
  });
});
