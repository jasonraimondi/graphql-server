// -- This is a parent command --
Cypress.Commands.add("dataTest", tag => {
  return cy.get(`[data-test=${tag}]`);
});

Cypress.Commands.add("getLastEmail", email => {
  console.log({ email });
  return cy
    .request("GET", `http://localhost:8025/api/v2/search?kind=to&query=${decodeURIComponent(email)}`)
    .then(({ body: { items } }) => {
      const lastEmail = items[0];
      console.log(lastEmail.Content.Body);

      if (lastEmail) {
        return {
          subject: "empty something",
          body: lastEmail.Content.Body,
        };
      }
      return;
    });
});

// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })

// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })

// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
