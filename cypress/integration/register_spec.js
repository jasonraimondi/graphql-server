describe("Register Page", () => {
  const email = cy.faker.internet.email();
  const first = cy.faker.name.firstName();
  const last = cy.faker.name.lastName();
  const password = cy.faker.internet.password();
  const foo = cy.faker.name.firstName();

  it("register", () => {
    cy.log(`this is the email: ${email}`);
    cy.log("BEFORE TEST");
    cy.log({ foo });
    cy.log({ email, first, last, password });

    cy.visit("/register");

    cy.dataTest("register-form--email")
      .click()
      .type(email);
    cy.dataTest("register-form--password")
      .click()
      .type(password);
    cy.dataTest("register-form--first")
      .click()
      .type(first);
    cy.dataTest("register-form--last")
      .click()
      .type(last);

    cy.dataTest("register-form").submit();

    cy.location().should(loc => {
      expect(loc.href).to.eq("http://localhost:3000/login");
    });
  });

  it("shows user is not active", () => {
    cy.visit("/login?redirectTo=/dashboard");
    cy.dataTest("login-form--email").click().type(email);
    cy.dataTest("login-form--password").click().type(password);
    cy.dataTest("login-form").submit();

    cy.contains("user is not active")
  });

  it("validate user email", () => {
    cy.getLastEmail(email).then(res => {
      cy.log("HI JASON JASON 11111");
      cy.log("SIMPLE PARSER");
      const parsedEmail = res.parsedBody.textAsHtml;
      const link = parsedEmail.match(/href="([^"]*)/)[1];
      cy.visit(link);
      cy.location().should(loc => {
        expect(loc.href).to.eq("http://localhost:3000/login");
      });
    });
  });

  it("user can log in", () => {
    cy.visit("/login?redirectTo=/dashboard");
    cy.dataTest("login-form--email").click().type(email);
    cy.dataTest("login-form--password").click().type(password);
    cy.dataTest("login-form").submit();

    cy.location().should(loc => {
      expect(loc.href).to.eq("http://localhost:3000/dashboard");
    });
    cy.getCookie("jit").should("exist");
    cy.getCookie("jid").should("exist");
  });

  it("user can log in", () => {
    cy.visit("/blank");

    cy.getCookie("jit").should("exist");
    cy.getCookie("jid").should("exist");
  });
});
