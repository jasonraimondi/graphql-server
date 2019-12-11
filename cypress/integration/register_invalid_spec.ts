describe("invalid emails", () => {
  const invalidEmails = [
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

  invalidEmails.forEach(invalid => {
    it(`login page shows invalid message for email: (${invalid})`, () => {
      cy.visit("/login");
      cy.dataTest("login-form--email")
        .click()
        .type(invalid)
        .contains("Invalid email");
      cy.focused().clear();
    });
  });

  invalidEmails.forEach(invalid => {
    it(`register page shows invalid message for email: (${invalid})`, () => {
      cy.visit("/register");
      cy.dataTest("register-form--email")
        .click()
        .type(invalid)
        .contains("Invalid email");
      cy.focused().clear();
    });
  });
});
