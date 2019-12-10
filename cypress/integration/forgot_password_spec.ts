describe("Forgot Password Page", () => {
  const email = cy.faker.internet.email();
  const password = cy.faker.internet.password();

  const updatedPassword = cy.faker.internet.password();

  it("forgot password", () => {
    cy.register({ email, password });
    cy.verifyUser(email);

    cy.visit("/login");
    cy.dataTest("forgot-password-link").click();

    cy.location().should(loc => {
      expect(loc.pathname).to.eq("/forgot_password");
    });
    cy.dataTest("forgot-password-form--email")
      .click()
      .type(email);
    cy.dataTest("forgot-password-form").submit();

    cy.location().should(loc => {
      expect(loc.pathname).to.eq("/");
    });
  });

  it("reset password using link in email is successful", () => {
    cy.getLastEmail(email).then(res => {
      const parsedEmail = res.parsedBody.textAsHtml;
      // @ts-ignore
      const link = parsedEmail.match(/href="([^"]*)/)[1];
      cy.visit(link);
      cy.location().should(loc => {
        expect(loc.pathname).to.eq("/reset_password");
      });

      cy.dataTest("reset-password-form--password").type(updatedPassword);

      cy.dataTest("reset-password-form").submit();

      cy.location().should(loc => {
        expect(loc.pathname).to.eq("/login");
      });
    });
  });

  it("fails using the old login", () => {
    cy.visit("/login");
    cy.dataTest("login-form--email")
      .click()
      .type(email);
    cy.dataTest("login-form--password")
      .click()
      .type(password);
    cy.dataTest("login-form").submit();

    cy.contains("invalid password");
  });

  it("succeeds using the new login", () => {
    cy.login({ email, password: updatedPassword });
  })
});
