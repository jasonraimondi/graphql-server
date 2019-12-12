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

    // refreshToken is valid and
    // we can send back an access refreshToken
    const uuid = payload && payload.userId ? payload.userId : "NOT_FOUND";
    const user = await this.userRepository.findById(uuid);

    if (user.tokenVersion !== payload.tokenVersion) {
      throw new Error("invalid refresh token");
    }
    console.log("UUPPPDATE ACCESS TOKEN");

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
      expiresIn: "10s",
    });
  }

  createRefreshToken(user: User): string {
    const payload = {
      userId: user.uuid,
      tokenVersion: user.tokenVersion,
    };
    return sign(payload, ENV.refreshTokenSecret, {
      expiresIn: "3m",
    });
  }

  sendRefreshToken(res: Response, user?: User) {
    let token = "";
    if (user) token = this.createRefreshToken(user);
    const expiresAt = Date.now() + 60 * 60 * 24 * 7; // 7 days
    res.cookie("jid", token, {
      httpOnly: true,
      // domain: ".example.com"
      domain: "localhost",
      expires: new Date(expiresAt),
    });
  }
}
