import { Response } from "express";
import { sign } from "jsonwebtoken";

import { User } from "@/entity/user_entity";

export const sendRefreshToken = (res: Response, token: string) => {
    res.cookie("jid", token, {
        // domain: "localhost",
        httpOnly: true,
        path: "/refresh_token",
    });
};

export const createAccessToken = (user: User) => {
    return sign({ userId: user.uuid }, process.env.ACCESS_TOKEN_SECRET!, {
        expiresIn: "15m",
    });
};

export const createRefreshToken = (user: User) => {
    return sign(
        { userId: user.uuid, tokenVersion: user.tokenVersion },
        process.env.REFRESH_TOKEN_SECRET!,
        {
            expiresIn: "7d",
        },
    );
};