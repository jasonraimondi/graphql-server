import { NextPageContext } from "next";
import { parseCookies } from "nookies";

import { setAccessToken } from "@/app/lib/auth/in_memory_access_token";
import { fetchAccessToken } from "@/app/lib/apollo_token_refresh_link";
import { getInMemoryTokens } from "@/app/lib/auth";

type RefreshTokenResponse = {
  success: boolean;
  accessToken: string;
};

export type TokenStrings = { jit: string; jid: string };

const FAILED_RESPONSE: TokenStrings = { jit: "", jid: "" };

export const updateExpiredToken = async (ctx: NextPageContext, guarded: boolean): Promise<TokenStrings> => {
  const { jid = "" } = parseCookies(ctx);
  const { accessToken, refreshToken } = getInMemoryTokens(jid);

  if (accessToken.isValid) {
    console.log("refresh.almostExpires", refreshToken.expiresAt, refreshToken.almostExpires, refreshToken.isExpired);
    return {
      jit: accessToken.token,
      jid: refreshToken.token,
    };
  }

  if (guarded) {
    setAccessToken("");

    if (refreshToken.token === "") {
      return FAILED_RESPONSE;
    }
    const updatedRefreshToken: RefreshTokenResponse = await fetchAccessToken(ctx);

    if (!updatedRefreshToken.success) {
      return FAILED_RESPONSE;
    }

    setAccessToken(updatedRefreshToken.accessToken);
    console.log("UPDATED REFRESH", updatedRefreshToken);
    return {
      jit: updatedRefreshToken.accessToken,
      jid: refreshToken.token,
    };
  }

  return {
    jit: "",
    jid: "",
  };
};
