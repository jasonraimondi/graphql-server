import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { v4 } from "uuid";

import { User } from "@/entity/user/user_entity";
import { Client } from "@/entity/oauth/client_entity";
import { Scopes } from "@/entity/oauth/scope";

@Entity({ name: "oauth_access_token" })
export class AccessToken {
  @PrimaryColumn("uuid")
  readonly token: string;

  @ManyToOne(() => Client)
  client: Client;

  @ManyToOne(() => User)
  user: User;

  @Column()
  expiresAt: Date;

  @Column("simple-array")
  scopes: Scopes;

  constructor(client: Client, user: User, token?: string) {
    this.client = client;
    this.user = user;
    this.token = token ?? v4();
  }
}
