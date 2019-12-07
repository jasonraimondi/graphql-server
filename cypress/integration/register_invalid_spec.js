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
    it("show invalid email message on register page", () => {
      cy.visit("/login?redirectTo=/dashboard");
      cy.dataTest("login-form--email")
        .click()
        .type(invalid)
        .contains("Invalid email");
      cy.focused().clear();
    });
  });

  invalidEmails.forEach(invalid => {
    it("show invalid email message on login page", () => {
      cy.visit("/register");
      cy.dataTest("register-form--email")
        .click()
        .type(invalid)
        .contains("Invalid email");
      cy.focused().clear();
    });
  });
});
