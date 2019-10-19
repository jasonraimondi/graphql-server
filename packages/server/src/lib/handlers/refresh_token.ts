import { Request, Response } from "express";
import { verify } from "jsonwebtoken";

import { User } from "@/entity/user";
import { createAccessToken, createRefreshToken, sendRefreshToken } from "@/lib/services/auth/auth_service";
import { STATUS_CODES } from "@/lib/handlers/status_codes";

const FAILED_TO_REFRESH = { success: false, accessToken: "" };

export const refreshToken = async (req: Request, res: Response) => {
    const token = req.cookies.jid;
    if (!token) {
        return fail(res);
    }

    let payload: any = null;
    try {
        payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
    } catch (err) {
        return fail(res);
    }

    // token is valid and
    // we can send back an access token
    const user = await User.findOne({ uuid: payload.userId });

    if (!user) {
        return fail(res);
    }

    if (user.tokenVersion !== payload.tokenVersion) {
        return fail(res);
    }

    sendRefreshToken(res, createRefreshToken(user));

    res.json({ success: true, accessToken: createAccessToken(user) });
};

function fail(res: Response) {
    res.status(STATUS_CODES.Unauthorized);
    res.json(FAILED_TO_REFRESH);
    return;
}

