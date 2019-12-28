import { controller, httpPost } from "inversify-express-utils";
import { inject } from "inversify";
import { Request, Response } from "express";

import { AuthService } from "@/lib/services/auth/auth_service";
import { STATUS_CODES } from "@/lib/constants/status_codes";
import { SERVICE } from "@/lib/constants/inversify";
import {RefreshToken} from "@/entity/auth/refresh_token";

@controller("/auth")
export class AuthController {
  private readonly FAILED_TO_REFRESH = { success: false, accessToken: "" };

  constructor(@inject(SERVICE.AuthService) private authService: AuthService) {}

  @httpPost("/refresh_token")
  async refreshToken(req: Request, res: Response) {
    // const rememberMe = req.cookies?.rememberMe;
    const refreshToken = new RefreshToken(req.cookies?.jid);

    if (refreshToken.isExpired) {
      res.status(STATUS_CODES.Unauthorized);
      res.json(this.FAILED_TO_REFRESH);
      return;
    }

    try {
      const { accessToken, user } = await this.authService.updateAccessToken(refreshToken.token);
      this.authService.sendRefreshToken(res, user);
      res.json({ success: true, accessToken });
      return;
    } catch (_) {}

    res.status(STATUS_CODES.Unauthorized);
    res.json(this.FAILED_TO_REFRESH);
    return;
  }
}
