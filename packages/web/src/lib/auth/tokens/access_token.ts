import jwtDecode from "jwt-decode";

export type DecodedAccessToken = {
  readonly email?: string;
  readonly exp: number;
  readonly isEmailConfirmed?: boolean;
  readonly userId?: string;
};

export class AccessToken {
  readonly decoded: DecodedAccessToken;

  constructor(public readonly token = "") {
    this.decoded = { exp: 0 };

    try {
      if (token) this.decoded = jwtDecode(token);
    } catch (e) {}
  }

  get expiresAt(): Date {
    return new Date(this.decoded.exp * 1000);
  }

  get isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  get isValid(): boolean {
    return !this.isExpired;
  }

  get authorizationString() {
    return `Bearer ${this.token}`;
  }
}
