import EOS from "express-oauth-server";
import { injectable } from "inversify";
import * as OAuth2Server from "oauth2-server";

@injectable()
export class ExpressOAuthServer {
  private readonly eos: EOS;

  constructor(eos = new EOS({
    model: require("@/model"),
    // grants: ["authorization_code", "refresh_token"],
  })) {
    this.eos = eos;
    console.log(this.eos);
  }

  authenticate(options?: OAuth2Server.AuthenticateOptions) {
    return this.eos.authenticate(options);
  }

  authorize(options?: OAuth2Server.AuthorizeOptions) {
    return this.eos.authorize(options);
  }

  token(options?: OAuth2Server.TokenOptions) {
    return (req, res, next) => this.eos.token(options)(req, res, next);
  }
}