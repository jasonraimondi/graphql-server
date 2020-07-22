import { controller, httpGet, httpPost } from "inversify-express-utils";
import { Request, Response } from "express";

import { STATUS_CODES } from "@/lib/constants/status_codes";
import { ExpressOAuthServer } from "@/lib/express_oauth_server";

@controller("/oauth")
export class AuthController {
  private readonly FAILED_TO_REFRESH = { success: false, accessToken: "" };

  constructor(private readonly oauth: ExpressOAuthServer) {}

  //   app.post('/oauth/token', oauth.token());


  @httpPost("/token")
  token(req: Request, res: Response) {
    console.log(req, res);
    return this.oauth.token();
  }

  @httpGet("/refresh_token")
  async refreshToken(_: Request, res: Response) {
    console.log(await this.oauth.token())
    res.status(STATUS_CODES.Unauthorized);
    res.json({
      ...this.FAILED_TO_REFRESH,
      ffoo: "barzy"
    });
    return;
  }
}
