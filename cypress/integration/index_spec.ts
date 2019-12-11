describe("homepage", () => {
  it("success", () => {
    cy.visit("/");

    cy.title().should("contain", "Hi ya slugger");
    cy.contains("user");
  });
});
