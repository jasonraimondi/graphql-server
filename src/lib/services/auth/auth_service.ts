import { Response } from "express";
import { sign, verify } from "jsonwebtoken";

import { User } from "@/entity/user/user_entity";
import { ENV } from "@/lib/constants/config";
import { inject, injectable } from "inversify";
import { REPOSITORY } from "@/lib/constants/inversify";
import { UserRepository } from "@/lib/repository/user/user_repository";

@injectable()
export class AuthService {
    constructor(@inject(REPOSITORY.UserRepository) private userRepository: UserRepository) {
    }

    async updateAccessToken(refreshToken: string) {
        let payload: any;
        try {
            payload = verify(refreshToken, ENV.refreshTokenSecret);
        } catch (e) {
            throw new Error("invalid refresh token");
        }

        // refreshToken is valid and
        // we can send back an access refreshToken
        const uuid = payload && payload.userId ? payload.userId : "NOT_FOUND";
        const user = await this.userRepository.findById(uuid);

        if (user.tokenVersion !== payload.tokenVersion) {
            throw new Error("invalid refresh token");
        }

        return {
            accessToken: this.createAccessToken(user),
            user,
        };
    }


    createAccessToken(user: User) {
        const payload = {
            userId: user.uuid,
            email: user.email,
            isEmailConfirmed: user.isEmailConfirmed
        };
        return sign(payload, ENV.accessTokenSecret, {
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

    sendRefreshToken(res: Response, user?: User) {
        let token = "";
        if (user) token = this.createRefreshToken(user!);
        res.cookie("jid", token, {
            // domain: "localhost",
            httpOnly: true,
            path: "/refresh_token",
        });
    }
}

