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
    cy.logout();
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

  it.skip("user auth works good", () => {
    const email = cy.faker.internet.email();
    cy.register({ email, password });
    cy.verifyUser(email);
    cy.login({ email, password });
    cy.reload(true);
    cy.reload(true);
    cy.wait(5000);
    cy.reload(true);
    cy.reload(true);
    cy.getCookie("jit").should("exist");
    cy.getCookie("jid").should("exist");
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
