import { controller, httpPost } from "inversify-express-utils";
import { Request, Response } from "express";

import { STATUS_CODES } from "@/lib/constants/status_codes";

@controller("/auth")
export class AuthController {
  private readonly FAILED_TO_REFRESH = { success: false, accessToken: "" };

  // constructor(@inject(SERVICE.AuthService) private authService: AuthService) {}

  @httpPost("/refresh_token")
  async refreshToken(_: Request, res: Response) {
    res.status(STATUS_CODES.Unauthorized);
    res.json(this.FAILED_TO_REFRESH);
    return;
  }
}
