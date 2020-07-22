import * as OAuth2Server from "oauth2-server";
import { v4 } from "uuid";

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

export default class ModelService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly accessTokenRepository: IAccessTokenRepository,
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    private readonly clientRepository: IClientRepository,
    private readonly authorizationCodeRepository: IAuthorizationCodeRepository
  ) {
  }

  generateAccessToken(client: OAuth2Server.Client, user: OAuth2Server.User, scope?: string): string {
    console.log(client, user, scope);
    return v4();
  }

  generateRefreshToken(client: OAuth2Server.Client, user: OAuth2Server.User, scope?: string): string {
    console.log(client, user, scope);
    return v4();
  }

  generateAuthorizationCode(client: OAuth2Server.Client, user: OAuth2Server.User, scope?: string): string {
    console.log(client, user, scope);
    return v4();
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

  async saveToken(token: OAuth2Server.Token, client: OAuth2Server.Client, user: OAuth2Server.User) {
    const oauthClient = await this.clientRepository.findById(client.id);
    const oauthUser = await this.userRepository.findByEmail(user.email);
    const accessToken = new AccessToken(oauthClient, oauthUser, token.accessToken);
    await this.accessTokenRepository.save(accessToken);

    if (token.refreshToken) {
      const refreshToken = new RefreshToken(oauthClient, oauthUser, token.refreshToken);
      await this.refreshTokenRepository.save(refreshToken)
    }
  }

  async saveAuthorizationCode(code: OAuth2Server.AuthorizationCode, client: OAuth2Server.Client, user: OAuth2Server.User) {
    const oauthClient = await this.clientRepository.findById(client.id);
    const oauthUser = await this.userRepository.findByEmail(user.email)
    const authorizationCode = new AuthorizationCode(oauthClient, oauthUser, code.authorizationCode);
    authorizationCode.expiresAt = code.expiresAt;
    authorizationCode.redirectUris = [code.redirectUri];
    await this.authorizationCodeRepository.save(authorizationCode)
  }

  async redirectUrievokeToken(t: OAuth2Server.Token) {
    if (t.refreshToken) {
      const token = await this.refreshTokenRepository.findById(t.refreshToken)
      token.revoke();
      await this.refreshTokenRepository.save(token);
    }
  }

  async revokeAuthorizationCode(code: OAuth2Server.AuthorizationCode) {
    const authorizationCode = await this.authorizationCodeRepository.findById(code.authorizationCode)
    authorizationCode.revoke();
    await this.authorizationCodeRepository.save(authorizationCode);
  }

  async validateScope(user: OAuth2Server.User, client: OAuth2Server.Client, scope: string) {
    console.log('validate scope', user, client, scope)
    return true;
  }
}
