import jwtDecode from "jwt-decode";

export type DecodedRefreshToken = {
  readonly exp: number;
  readonly userId?: string;
};

export class RefreshToken {
  readonly decoded: DecodedRefreshToken;

  constructor(public readonly token = "") {
    this.decoded = { exp: 0 };

    try {
      if (token) this.decoded = jwtDecode(token);
    } catch (e) {}
  }

  get expiresAt(): Date {
    return new Date(this.decoded.exp * 1000);
  }

  get almostExpires(): boolean {
    const thirtySeconds = Date.now() + 1000 * 30;
    return new Date(thirtySeconds) > this.expiresAt;
  }

  get isExpired(): boolean {
    return new Date() > this.expiresAt;
  }
}
