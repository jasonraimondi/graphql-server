describe("Forgot Password Page", () => {
  beforeEach(() => {
    cy.request("DELETE", "http://localhost:8025/api/v1/messages");
  });

  it("forgot password", () => {
    cy.visit("http://localhost:3000/login");
    cy.get("#forgot-password-link").click();

    cy.location().should(loc => {
      expect(loc.href).to.eq("http://localhost:3000/forgot_password");
    });
    cy.get("#forgot-password-form--email")
      .click()
      .type("jason@raimondi.us");

    cy.get(`#forgot-password-form`).submit();

    cy.location().should(loc => {
      expect(loc.href).to.eq("http://localhost:3000/");
    });

    cy.request("http://localhost:8025/api/v2/messages").then(res => {
      console.log(res.body.items[0].Raw.Data);
      expect(res.body.total).to.eq(1);
    });
  });
});
