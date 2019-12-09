declare namespace Cypress {
  type ParsedEmail = {
    body: string;
    parsedBody: {
      textAsHtml: string;
    }
    subject: string;
    to: string;
    from: string;
  };

  interface Chainable {
    faker: any;

    dataTest(value: string): Chainable<Element>;

    login(email: string, password: string, redirectTo?: string): Chainable<void>;
    register(email: string, password: string, redirectTo?: string): Chainable<void>;

    getLastEmail(value: string): Chainable<ParsedEmail>;
  }
}