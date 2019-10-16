import { sign } from "jsonwebtoken";

import { User } from "@/entity/user";

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