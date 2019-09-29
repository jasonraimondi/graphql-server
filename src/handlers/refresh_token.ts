import { Request, Response } from "express";
import { verify } from "jsonwebtoken";

import { User } from "@entity/user";
import { sendRefreshToken } from "@handlers/send_refresh_token";
import { createAccessToken, createRefreshToken } from "@handlers/auth";

export const refreshToken = async (req: Request, res: Response) => {
    const token = req.cookies.jid;
    if (!token) {
        return res.send({ ok: false, accessToken: "" });
    }

    let payload: any = null;
    try {
        payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
    } catch (err) {
        console.log(err);
        return res.send({ ok: false, accessToken: "" });
    }

    // token is valid and
    // we can send back an access token
    const user = await User.findOne({ uuid: payload.userId });

    if (!user) {
        return res.send({ ok: false, accessToken: "" });
    }

    if (user.tokenVersion !== payload.tokenVersion) {
        return res.send({ ok: false, accessToken: "" });
    }

    sendRefreshToken(res, createRefreshToken(user));

    return res.send({ ok: true, accessToken: createAccessToken(user) });
};
