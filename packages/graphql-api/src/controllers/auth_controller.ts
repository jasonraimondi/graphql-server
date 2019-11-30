import { controller, httpPost } from "inversify-express-utils";
import { inject } from "inversify";
import { Request, Response } from "express";

import { AuthService } from "@/lib/services/auth/auth_service";
import { STATUS_CODES } from "@/lib/constants/status_codes";
import { SERVICE } from "@/lib/constants/inversify";

@controller("/auth")
export class AuthController {
    private readonly FAILED_TO_REFRESH = { success: false, accessToken: "" };

    constructor(
        @inject(SERVICE.AuthService) private authService: AuthService
    ) {}

    @httpPost("/refresh_token")
    async refreshToken(req: Request, res: Response) {
        const refreshToken = req.cookies?.jid;

        if (!refreshToken) {
            res.status(STATUS_CODES.Unauthorized);
            res.json(this.FAILED_TO_REFRESH);
            return;
        }

        try {
            const {
                accessToken,
                user,
            } = await this.authService.updateAccessToken(refreshToken);
            this.authService.sendRefreshToken(res, user);
            res.json({ success: true, accessToken });
            return;
        } catch (e) {}

        res.status(STATUS_CODES.Unauthorized);
        res.json(this.FAILED_TO_REFRESH);
        return;
    }
}
