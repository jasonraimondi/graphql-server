import { controller, httpPost } from "inversify-express-utils";
import { inject } from "inversify";
import { Request, Response } from "express";

import { AuthService, sendRefreshToken } from "@/lib/services/auth/auth_service";
import { STATUS_CODES } from "@/lib/constants/status_codes";
import { SERVICE } from "@/lib/constants/inversify";


@controller("/auth")
export class AuthController {
    private readonly FAILED_TO_REFRESH = { success: false, accessToken: "" };

    constructor(@inject(SERVICE.AuthService) private authService: AuthService) {
    }

    @httpPost("/refresh_token")
    async refreshToken(req: Request, res: Response) {
        const token = req.cookies.jid;

        if (!token) {
            res.status(STATUS_CODES.Unauthorized);
            res.json(this.FAILED_TO_REFRESH);
            return;
        }

        try {
            const { accessToken, refreshToken } = await this.authService.refreshToken(token);
            sendRefreshToken(res, refreshToken);
            res.json({ success: true, accessToken });
            return;
        } catch (e) {
            console.log(e);
        }

        res.status(STATUS_CODES.Unauthorized);
        res.json(this.FAILED_TO_REFRESH);
        return;
    }
}


