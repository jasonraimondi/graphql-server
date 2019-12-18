import jwtDecode from "jwt-decode";

export type DecodedRefreshToken = {
  readonly exp: number;
  readonly userId?: string;
};

export class RefreshToken {
  readonly decoded: DecodedRefreshToken;

  constructor(public readonly token: string = "") {
    this.decoded = { exp: 0 };

    try {
      if (token) this.decoded = jwtDecode(token);
    } catch (e) {}
  }

  get expiresAt(): Date {
    return new Date(this.decoded.exp * 1000);
  }

  get almostExpires(): boolean {
    // ten minutes;
    // const _result = this.expiresAt.getTime() - Date.now() + 1000 * 60 * 10;
    const result2 = this.expiresAt.getTime() - Date.now() + 1000 * 30;
    return new Date(result2) > this.expiresAt; // does token expire within 10 minutes?
  }

  get isExpired(): boolean {
    return new Date() > this.expiresAt;
  }
}
