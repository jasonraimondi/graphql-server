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

  type RegisterData = {
    email: string;
    password: string;
    first?: string;
    last?: string;
  }

  type LoginData = {
    email: string;
    password: string;
    redirectTo?: string;
  }

  interface Chainable {
    faker: any;

    dataTest(value: string): Chainable<Element>;

    logout(): Chainable<void>;
    login(data: LoginData): Chainable<void>;
    register(data: RegisterData): Chainable<void>;
    verifyUser(email: string): Chainable<void>;

    getLastEmail(value: string): Chainable<ParsedEmail>;
  }
}