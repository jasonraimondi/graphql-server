import { simpleParser } from "mailparser";

// -- This is a parent command --
Cypress.Commands.add("dataTest", tag => {
  return cy.get(`[data-test=${tag}]`);
});

Cypress.Commands.add("getLastEmail", email => {
  cy.log({ email });
  const url = `http://localhost:8025/api/v2/search?kind=to&query=${decodeURIComponent(email)}`;
  return cy
    .request("GET", url)
    .then(res => {
      const {
        body: { items },
      } = res;
      const lastEmail = items[0];

      expect(lastEmail).not.to.be.undefined;

      const [to] = lastEmail.Content.Headers.To;
      const [from] = lastEmail.Content.Headers.From;
      const [subject] = lastEmail.Content.Headers.Subject;
      const body = lastEmail.Content.Body;

      return { subject, body, to, from };
    })
    .then(({ subject, body, to, from }) => {
      return simpleParser(body, {}).then(parsedBody => {
        return {
          subject,
          body,
          parsedBody,
          to,
          from,
        };
      });
    });
});

// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })

// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })

// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
