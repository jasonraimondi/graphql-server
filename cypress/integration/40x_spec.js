describe("40x errors", () => {
  const email = cy.faker.internet.email();
  const first = cy.faker.name.firstName();
  const last = cy.faker.name.lastName();
  const password = cy.faker.internet.password();

  it("404 not found", () => {
    cy.visit("/foo_bar", {failOnStatusCode: false});
    cy.contains("404");
  });
});
