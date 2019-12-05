describe("Register Page", () => {
  beforeEach(() => {
    cy.request("DELETE", "http://localhost:8025/api/v1/messages");
  });

  it("register", () => {
    cy.visit("http://localhost:3000/register");

    cy.get("#register-form--email")
      .click()
      .type("jason4@raimondi.us");
    cy.get("#register-form--password")
      .click()
      .type("jasonraimondi");
    cy.get("#register-form--first")
      .click()
      .type("Jason");
    cy.get("#register-form--last")
      .click()
      .type("Raimondi");

    cy.get("#register-form").submit();

    // cy.location().should(loc => {
    //   expect(loc.href).to.eq("http://localhost:3000/");
    // });

    cy.request("http://localhost:8025/api/v2/messages").then(res => {
      console.log(res.body.items[0].Raw.Data);
      expect(res.body.total).to.eq(1);
    });
  });
});
