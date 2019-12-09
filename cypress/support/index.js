import * as faker from "faker";

import "./commands";

Cypress.Cookies.debug(true);

cy.faker = faker;
