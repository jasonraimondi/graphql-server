import { simpleParser } from "mailparser";

Cypress.Commands.add("dataTest", tag => {
  return cy.get(`[data-test=${tag}]`);
});

Cypress.Commands.add("logout", () => {
  cy.visit("/logout");

  cy.location().should(loc => {
    expect(loc.pathname).to.eq("/login");
  });
  cy.getCookie("jid").should("not.exist");
});

Cypress.Commands.add("register", ({ email, password, first, last }) => {
  cy.visit("/register");

  cy.dataTest("register-form--email")
    .click()
    .type(email);
  if (password)
    cy.dataTest("register-form--password")
      .click()
      .type(password);
  if (first)
    cy.dataTest("register-form--first")
      .click()
      .type(first);
  if (last)
    cy.dataTest("register-form--last")
      .click()
      .type(last);

  cy.dataTest("register-form").submit();

  cy.location().should(loc => {
    expect(loc.pathname).to.eq("/login");
  });
});

Cypress.Commands.add("login", ({ email, password, redirectTo = "/dashboard" }) => {
  cy.visit(`/login?redirectTo=${redirectTo}`);
  cy.dataTest("login-form--email")
    .click()
    .type(email);
  cy.dataTest("login-form--password")
    .click()
    .type(password);
  cy.dataTest("login-form--remember-me").click();
  cy.dataTest("login-form").submit();

  cy.location().should(loc => {
    expect(loc.pathname).to.eq(redirectTo);
  });
  cy.getCookie("jid").should("exist");
  cy.getCookie("rememberMe").should("have.property", "value", "true");
});

Cypress.Commands.add("verifyUser", email => {
  cy.getLastEmail(email).then(res => {
    const parsedEmail = res.parsedBody.textAsHtml;
    const link = parsedEmail.match(/href="([^"]*)/)[1];
    cy.visit(link);
    cy.location().should(loc => {
      expect(loc.pathname).to.eq("/login");
    });
  });
});

Cypress.Commands.add("getLastEmail", email => {
  const url = `${Cypress.env("MAILER_HTTP_URL")}/api/v2/search?kind=to&query=${decodeURIComponent(email)}`;
  return cy
    .request("GET", url)
    .then(({ body: { items } }) => {
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
