describe("Register Page", () => {
  beforeEach(() => {
    cy.request("DELETE", "http://localhost:8025/api/v1/messages");
  });

  it.skip("show invalid email message", () => {
    cy.visit("http://localhost:3000/login?redirectTo=/dashboard");

    const emails = [
      "plainaddress",
      "jason",
      "#@%^%#$@#$@#.com",
      "@example.com",
      "Joe Smith <email@example.com>",
      // "email.example.com",
      // "email@example@example.com",
      // ".email@example.com",
      // "email.@example.com",
      // "email..email@example.com",
    ];

    for (let email of emails) {
      cy.dataTest("login-form--email")
        .click()
        .type(email)
        .contains("Invalid email");
      cy.focused().clear();
    }
  });

  it("register", () => {
    const email = cy.faker.internet.email();
    const first = cy.faker.name.firstName();
    const last = cy.faker.name.lastName();
    const password = cy.faker.internet.password();

    cy.visit("http://localhost:3000/register");

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

    cy.wait(1000);

    // cy.location().should(loc => {
    //   expect(loc.href).to.eq("http://localhost:3000/");
    // });
    console.log("HI JASON 1");
    cy.getLastEmail(email).then(res => {
      expect(res).is.not.undefined;
      const matches = res!.body.match(/href="([^"]*)/);
      console.log(matches, matches![1]);
      console.log("get email", res);
      // cy.visit(link);
      cy.contains("Your email address has been verified!");
    });
  });
});
