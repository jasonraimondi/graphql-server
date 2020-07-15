import { IUserRepository } from "@/lib/repository/user/user_repository";
import type { User } from "@/entity/user/user_entity";
import { IAccessTokenRepository } from "@/lib/repository/oauth/access_token_repository";
import { IRefreshTokenRepository } from "@/lib/repository/oauth/refresh_token_repository";
import { Client } from "@/entity/oauth/client_entity";
import { IClientRepository } from "@/lib/repository/oauth/client_repository";
import { AuthorizationCode } from "@/entity/oauth/authorization_code_entity";
import { RefreshToken } from "@/entity/oauth/refresh_token_entity";
import { IAuthorizationCodeRepository } from "@/lib/repository/oauth/authorization_code_repository";
import { AccessToken } from "@/entity/oauth/access_token_entity";
import { Debugger } from "inspector";
import Scope = module
// import { IAuthorizationCodeRepository } from "@/lib/repository/oauth/authorization_code_repository";

type AuthorizationCodeParams = {
  authorizationCode: string;
  expiresAt: Date;
  redirectUri: string;
  scope?: string;
};

type AccessTokenParams = {
  accessToken: string;
  accessTokenExpiresAt: Date;
  refreshToken?: string;
  refreshTokenExpiresAt?: Date;
  scope?: string;
};

export default class ModelService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly accessTokenRepository: IAccessTokenRepository,
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    private readonly clientRepository: IClientRepository,
    private readonly authorizationCodeRepository: IAuthorizationCodeRepository
  ) {
  }

  generateAccessToken(client: Client, user: User, scope?: string): string {
    console.log(client, user, scope);
    return "";
  }

  generateRefreshToken(client: Client, user: User, scope?: string): string {
    console.log(client, user, scope);
    return "";
  }

  generateAuthorizationCode(client: Client, user: User, scope?: string): string {
    console.log(client, user, scope);
    return "";
  }

  async getUser(username: string, password: string): Promise<User> {
    const user = await this.userRepository.findByEmail(username);
    await user.verify(password);
    return user;
  }

  async getAccessToken(token: string) {
    return this.accessTokenRepository.findById(token);
  }

  async getRefreshToken(token: string): Promise<RefreshToken> {
    return this.refreshTokenRepository.findById(token);
  }

  async getAuthorizationCode(token: string): Promise<AuthorizationCode> {
    return this.authorizationCodeRepository.findById(token);
  }

  async getClient(clientId: string, clientSecret: string): Promise<Client> {
    const client = await this.clientRepository.findById(clientId);
    if (client.verify(clientSecret)) {
      throw new Error("Invalid client secret")
    }
    return client;
  }

  async saveToken(token: AccessTokenParams, client: Client, user: User) {
    const accessToken = new AccessToken(client, user, token.accessToken);
    accessToken.expiresAt = token.accessTokenExpiresAt;
    await this.accessTokenRepository.save(accessToken);

    if (token.refreshToken) {
      const refreshToken = new RefreshToken(client, user, token.refreshToken);
      if (token.refreshTokenExpiresAt) refreshToken.expiresAt = token.refreshTokenExpiresAt;
      await this.refreshTokenRepository.save(refreshToken)
    }
  }

  async saveAuthorizationCode(code: AuthorizationCodeParams, client: Client, user: User) {
    const authorizationCode = new AuthorizationCode(client, user, code.authorizationCode);
    authorizationCode.expiresAt = code.expiresAt;
    authorizationCode.redirectUris = [code.redirectUri];
    await this.authorizationCodeRepository.save(authorizationCode)
  }

  // async revokeToken(token: {  })

  async revokeAuthorizationCode(code: AuthorizationCode) {
    code.expiresAt = new Date(0);
    await this.authorizationCodeRepository.save(code);
  }

  async validateScope(user: User, client: Client, scope: Scope) {
    console.log('validate scope', user, client, scope)
    return true;
  }
}
