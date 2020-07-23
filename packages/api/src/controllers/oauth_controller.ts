import { controller, httpPost, next, request, response } from "inversify-express-utils";
import { NextFunction, Request, Response } from "express";

import { ExpressOAuthServer } from "@/lib/express_oauth_server";
import { SERVICE } from "@/lib/constants/inversify";
import { inject } from "inversify";

@controller("/oauth")
export class AuthController {
  constructor(@inject(SERVICE.OAuthServerService) private readonly oauth: ExpressOAuthServer) {}


  @httpPost("/token")
  token(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
    return this.oauth.token()(req, res, next);
  }

  @httpPost("/authorize")
  authorize(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
    return this.oauth.authorize()(req, res, next);
  }
}
