import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";

import { Client } from "@/entity/oauth/client_entity";
import { User } from "@/entity/user/user_entity";
import { v4 } from "uuid";
import { RedirectUris, Scopes } from "@/entity/oauth/scope";

@Entity({ name: "oauth_authorization_code" })
export class AuthorizationCode {
  @PrimaryColumn("uuid")
  readonly code: string;

  @ManyToOne(() => Client)
  client: Client;

  @ManyToOne(() => User)
  user: User;

  @Column()
  expiresAt: Date;

  @Column("simple-array")
  redirectUris: RedirectUris;

  @Column("simple-array")
  scopes: Scopes;

  revoke() {
    this.expiresAt = new Date(0);
  }

  constructor(client: Client, user: User, code?: string) {
    this.client = client;
    this.user = user;
    this.code = code ?? v4();
    this.redirectUris = [];
    this.expiresAt = addDays(new Date(), 30)
  }
}


export const addDays = (date: Date, days: number) => {
  date.setDate(date.getDate() + days);
  return date;
}
