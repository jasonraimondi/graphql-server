import { controller, httpPost } from "inversify-express-utils";
import { inject } from "inversify";
import { Request, Response } from "express";
import { verify } from "jsonwebtoken";

import { createAccessToken, createRefreshToken, sendRefreshToken } from "@/lib/services/auth/auth_service";
import { STATUS_CODES } from "@/lib/constants/status_codes";
import { UserRepository } from "@/lib/repository/user/user_repository";
import { REPOSITORIES } from "@/lib/constants/inversify";

const FAILED_TO_REFRESH = { success: false, accessToken: "" };

@controller("/auth")
export class AuthController {
    constructor(@inject(REPOSITORIES.User) private userRepository: UserRepository) {}

    @httpPost("/refresh_token")
    async refreshToken(req: Request, res: Response) {
        const token = req.cookies.jid;
        if (!token) {
            return this.fail(res);
        }

        let payload: any = null;
        try {
            payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
        } catch (err) {
            return this.fail(res);
        }

        // token is valid and
        // we can send back an access token
        const user = await this.userRepository.findOne({ uuid: payload.userId });

        if (!user) {
            return this.fail(res);
        }

        if (user.tokenVersion !== payload.tokenVersion) {
            return this.fail(res);
        }

        sendRefreshToken(res, createRefreshToken(user));

        res.json({ success: true, accessToken: createAccessToken(user) });
    }

    private fail(res: Response) {
        res.status(STATUS_CODES.Unauthorized);
        res.json(FAILED_TO_REFRESH);
        return;
    }
}


