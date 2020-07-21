import { controller, httpGet } from "inversify-express-utils";
import { Request, Response } from "express";

import { STATUS_CODES } from "@/lib/constants/status_codes";
import { ExpressOAuthServer } from "@/lib/express_oauth_server";

@controller("/auth")
export class AuthController {
  private readonly FAILED_TO_REFRESH = { success: false, accessToken: "" };

  constructor(private readonly oauth: ExpressOAuthServer) {}

  @httpGet("/refresh_token")
  async refreshToken(_: Request, res: Response) {
    console.log(this.oauth.token({ res }))
    res.status(STATUS_CODES.Unauthorized);
    res.json({
      ...this.FAILED_TO_REFRESH,
      ffoo: "barzy"
    });
    return;
  }
}
