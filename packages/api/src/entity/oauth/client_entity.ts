import { Column, Entity, PrimaryColumn } from "typeorm";

import { v4 } from "uuid";
import { RedirectUris, Scopes } from "@/entity/oauth/scope";

@Entity({ name: "oauth_client" })
export class Client {
  @PrimaryColumn("uuid")
  readonly identifier: string;

  @Column()
  secret: string;

  @Column()
  name: string;

  @Column("simple-array")
  redirectUris: RedirectUris;

  @Column("simple-array")
  scopes: Scopes;

  verify(s: string) {
    return this.secret === s;
  }

  constructor(name: string, identifier?: string, secret?: string, redirectUris?: string[]) {
    this.name = name;
    this.identifier = identifier ?? v4();
    this.secret = secret ?? v4();
    this.redirectUris = redirectUris ?? [];
  }
}
