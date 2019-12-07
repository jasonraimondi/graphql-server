describe("Register Page", () => {
  const email = cy.faker.internet.email();
  const first = cy.faker.name.firstName();
  const last = cy.faker.name.lastName();
  const password = cy.faker.internet.password();
  const foo = cy.faker.name.firstName();

  it("register", () => {
    cy.log(`this is the email: ${email}`);
    cy.log("BEFORE TEST");
    cy.log({foo});
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

  it("show invalid email message on register page", () => {
    cy.log("BEFORE TEST");
    cy.log({ email, first, last, password });
    cy.log({foo});

    cy.visit("/register");

    cy.dataTest("register-form--email")
      .click()
      .type(email);

    cy.getLastEmail(email).then(res => {
      cy.log(res);
    });
  });
});
