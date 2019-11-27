import { Response } from "express";
import { sign, verify } from "jsonwebtoken";
import { inject, injectable } from "inversify";

import { User } from "../../../entity/user/user_entity";
import { ENV } from "../../constants/config";
import { REPOSITORY } from "../../constants/inversify";
import { IUserRepository } from "../../repository/user/user_repository";

@injectable()
export class AuthService {
    constructor(@inject(REPOSITORY.UserRepository) private userRepository: IUserRepository) {
    }

    async updateAccessToken(refreshToken: string) {
        let payload: any;
        try {
            payload = verify(refreshToken, ENV.refreshTokenSecret);
        } catch (e) {
            console.log(e);
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
            expiresIn: "1m",
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
        // 7 days
        const expiresAt = Date.now() + (60 * 60 * 24 * 7);
        res.cookie("jid", token, {
            httpOnly: true,
            // domain: ".example.com"
            domain: "localhost",
            expires: new Date(expiresAt),
        });
    }
}

