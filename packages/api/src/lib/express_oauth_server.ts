import EOS from "express-oauth-server";
import { decorate, injectable } from "inversify";

decorate(injectable(), EOS);

@injectable()
export class ExpressOAuthServer extends EOS {
}
