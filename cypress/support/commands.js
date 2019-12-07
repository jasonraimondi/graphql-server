// -- This is a parent command --
Cypress.Commands.add("dataTest", tag => {
  return cy.get(`[data-test=${tag}]`);
});

Cypress.Commands.add("getLastEmail", email => {
  cy.wait(1500);
  return cy
    .request("GET", `http://localhost:8025/api/v2/search?kind=to&query=${decodeURIComponent(email)}`)
    .then(({ body: { items } }) => {
      const lastEmail = items[0];
      if (lastEmail) {
        const [to] = lastEmail.Content.Headers.To;
        return {
          subject: "empty something",
          body: lastEmail.Content.Body,
          to,
        };
      }
    });
});

// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })

// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })

// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
