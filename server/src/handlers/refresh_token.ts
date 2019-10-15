import { Request, Response } from "express";
import { verify } from "jsonwebtoken";

import { User } from "@/entity/user";
import { sendRefreshToken } from "@/handlers/send_refresh_token";
import { createAccessToken, createRefreshToken } from "@/handlers/auth";

const FAILED_TO_REFRESH = { success: false, accessToken: "" };

export const refreshToken = async (req: Request, res: Response) => {
    const token = req.cookies.jid;
    if (!token) {
        return res.send(FAILED_TO_REFRESH);
    }

    let payload: any = null;
    try {
        payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
    } catch (err) {
        return res.send(FAILED_TO_REFRESH);
    }

    // token is valid and
    // we can send back an access token
    const user = await User.findOne({ uuid: payload.userId });

    if (!user) {
        return res.send(FAILED_TO_REFRESH);
    }

    if (user.tokenVersion !== payload.tokenVersion) {
        return res.send(FAILED_TO_REFRESH);
    }

    sendRefreshToken(res, createRefreshToken(user));

    return res.send({ success: true, accessToken: createAccessToken(user) });
};
