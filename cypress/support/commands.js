import { simpleParser } from "mailparser";

// -- This is a parent command --
Cypress.Commands.add("dataTest", tag => {
  return cy.get(`[data-test=${tag}]`);
});

Cypress.Commands.add("register", ({ email, password, first, last }) => {
  cy.visit("/register");

  cy.dataTest("register-form--email")
    .click()
    .type(email);
  cy.dataTest("register-form--password")
    .click()
    .type(password);
  cy.dataTest("register-form--first")
    .click()
    .type(first);
  cy.dataTest("register-form--last")
    .click()
    .type(last);

  cy.dataTest("register-form").submit();

  cy.location().should(loc => {
    expect(loc.href).to.eq("http://localhost:3000/login");
  });
});

Cypress.Commands.add("login", (email, password, redirectTo = "/dashboard") => {
  cy.visit(`/login?redirectTo=${redirectTo}`);
  cy.dataTest("login-form--email")
    .click()
    .type(email);
  cy.dataTest("login-form--password")
    .click()
    .type(password);
  cy.dataTest("login-form").submit();

  cy.location().should(loc => {
    expect(loc.href).to.eq(`http://localhost:3000${redirectTo}`);
  });
  cy.getCookie("jit").should("exist");
  cy.getCookie("jid").should("exist");
});

Cypress.Commands.add("getLastEmail", email => {
  const url = `${Cypress.env("MAILER_URL")}/api/v2/search?kind=to&query=${decodeURIComponent(email)}`;
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
