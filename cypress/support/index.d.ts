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

    getLastEmail(value: string): Chainable<ParsedEmail>;
  }
}