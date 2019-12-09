describe("Forgot Password Page", () => {
  it("forgot password", () => {
    cy.visit("/login");
    cy.dataTest("forgot-password-link").click();

    cy.location().should(loc => {
      expect(loc.pathname).to.eq("/forgot_password");
    });
    const email = "jason@raimondi.us";
    cy.dataTest("forgot-password-form--email")
      .click()
      .type(email);

    cy.dataTest("forgot-password-form").submit();

    cy.location().should(loc => {
      expect(loc.pathname).to.eq("/");
    });

    // cy.getLastEmail(email).then(res => {
    //   console.log(res);
    // });
  });
});
