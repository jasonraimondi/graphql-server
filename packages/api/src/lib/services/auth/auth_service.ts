import { Response } from "express";
import { sign, verify } from "jsonwebtoken";
import { inject, injectable } from "inversify";

import { User } from "@/entity/user/user_entity";
import { IUserRepository } from "@/lib/repository/user/user_repository";
import { REPOSITORY } from "@/lib/constants/inversify";
import { ENV } from "@/lib/constants/config";

@injectable()
export class AuthService {
  constructor(
    @inject(REPOSITORY.UserRepository)
    private userRepository: IUserRepository
  ) {}

  async updateAccessToken(refreshToken: string) {
    let payload: any;
    try {
      payload = verify(refreshToken, ENV.refreshTokenSecret);
    } catch (e) {
      throw new Error("invalid refresh token");
    }

    const uuid = payload?.userId ?? "NOT_FOUND";
    const user = await this.userRepository.findById(uuid);

    if (user.tokenVersion !== payload.tokenVersion) {
      throw new Error("invalid refresh token");
    }

    return {
      accessToken: this.createAccessToken(user),
      user,
    };
  }

  createAccessToken(user: User): string {
    const payload = {
      userId: user.uuid,
      email: user.email,
      isEmailConfirmed: user.isEmailConfirmed,
    };
    return sign(payload, ENV.accessTokenSecret, {
      expiresIn: ENV.accessTokenTimeout,
    });
  }

  createRefreshToken(user: User, _rememberMe = false): string {
    const payload = {
      userId: user.uuid,
      tokenVersion: user.tokenVersion,
    };
    return sign(payload, ENV.refreshTokenSecret, {
      expiresIn: ENV.refreshTokenTimeout,
    });
  }

  sendRefreshToken(res: Response, rememberMe: boolean, user?: User) {
    let token = "";

    // @todo pass rememberMe to createRefreshToken
    if (user) token = this.createRefreshToken(user);

    if (rememberMe) {
      res.cookie("rememberMe", true, {
        httpOnly: true,
        domain: "localhost",
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      });
    }

    res.cookie("jid", token, {
      httpOnly: true,
      // domain: ".example.com"
      domain: "localhost",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    });
  }
}
