describe("Register Page", () => {
  const email = cy.faker.internet.email();
  const first = cy.faker.name.firstName();
  const last = cy.faker.name.lastName();
  const password = cy.faker.internet.password();

  it("register", () => {
    cy.register({ email, first, last, password });
    assertUserIsNotValid({ email, password });
    cy.verifyUser(email);
    cy.login({ email, password });
    cy.logout();
  });
});

function assertUserIsNotValid({ email, password }) {
  cy.visit("/login?redirectTo=/dashboard");
  cy.dataTest("login-form--email")
    .click()
    .type(email);
  cy.dataTest("login-form--password")
    .click()
    .type(password);
  cy.dataTest("login-form").submit();

  cy.contains("user is not active");
}
