describe("user registration flow", () => {
  const email = cy.faker.internet.email();
  const first = cy.faker.name.firstName();
  const last = cy.faker.name.lastName();
  const password = "password-1234!";

  it("user can register, verify email, and successfully login", () => {
    cy.register({ email, first, last, password });
    assertUserIsNotVerified({ email, password });
    cy.verifyUser(email);
    cy.login({ email, password });
    cy.contains("Profile");
    cy.contains("Logout");
    cy.logout();
    cy.contains("Login");
    cy.contains("Register");
  });

  it("user can register with only email and password", () => {
    const email = cy.faker.internet.email();
    cy.register({ email, password });
    cy.verifyUser(email);
  });

  it("user can register with only email", () => {
    const email = cy.faker.internet.email();
    cy.register({ email });
    cy.verifyUser(email);
  });

  function assertUserIsNotVerified({ email, password }: { email: string; password: string }) {
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
});
