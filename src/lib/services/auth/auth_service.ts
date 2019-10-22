import { Response } from "express";
import { sign, verify } from "jsonwebtoken";

import { User } from "@/entity/user_entity";
import { ENV } from "@/lib/constants/config";
import { inject, injectable } from "inversify";
import { REPOSITORY } from "@/lib/constants/inversify";
import { UserRepository } from "@/lib/repository/user/user_repository";

@injectable()
export class AuthService {
    constructor(@inject(REPOSITORY.UserRepository) private userRepository: UserRepository) {
    }

    async refreshToken(token: string) {
        let payload: any;
        try {
            payload = verify(token, ENV.refreshTokenSecret);
        } catch (e) {
            throw new Error("invalid token");
        }

        // token is valid and
        // we can send back an access token
        const uuid = payload && payload.userId ? payload.userId : "NOT_FOUND";
        const user = await this.userRepository.findById(uuid);

        if (user.tokenVersion !== payload.tokenVersion) {
            throw new Error("invalid token");
        }

        return {
            accessToken: this.createAccessToken(user),
            refreshToken: this.createRefreshToken(user),
        };
    }


    createAccessToken(user: User) {
        return sign({ userId: user.uuid }, ENV.accessTokenSecret, {
            expiresIn: "15m",
        });
    }

    createRefreshToken(user: User) {
        return sign(
            { userId: user.uuid, tokenVersion: user.tokenVersion },
            ENV.refreshTokenSecret,
            {
                expiresIn: "7d",
            },
        );
    }
}

export const sendRefreshToken = (res: Response, token: string) => {
    res.cookie("jid", token, {
        // domain: "localhost",
        httpOnly: true,
        path: "/refresh_token",
    });
};
