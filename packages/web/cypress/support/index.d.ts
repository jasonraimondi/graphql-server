declare namespace Cypress {
  interface Chainable {
    faker: any;
    dataTest(value: string): Chainable<Element>;
    getLastEmail(value: string): Chainable<{ body: string; subject: string; }|undefined>;
  }
}