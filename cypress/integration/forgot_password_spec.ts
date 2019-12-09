describe("Forgot Password Page", () => {
  // beforeEach(() => {
  //   cy.request("DELETE", "http://localhost:8025/api/v1/messages");
  // });

  it("forgot password", () => {
    cy.visit("/login");
    cy.dataTest("forgot-password-link").click();

    cy.location().should(loc => {
      expect(loc.href).to.eq("http://localhost:3000/forgot_password");
    });
    const email = "jason@raimondi.us";
    cy.dataTest("forgot-password-form--email")
      .click()
      .type(email);

    cy.dataTest("forgot-password-form").submit();

    cy.location().should(loc => {
      expect(loc.href).to.eq("http://localhost:3000/");
    });

    cy.getLastEmail(email).then(res => {
      console.log(res);
    });
  });
});
