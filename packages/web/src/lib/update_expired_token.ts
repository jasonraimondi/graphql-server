import { setAccessToken } from "@/app/lib/auth/in_memory_access_token";
import { fetchAccessToken } from "@/app/lib/apollo_token_refresh_link";
import { getInMemoryTokens } from "@/app/lib/auth";
import { NextPageContext } from "next";
import { parseCookies } from "nookies";

type RefreshTokenResponse = {
  success: boolean;
  accessToken: string;
};

const FAILED_RESPONSE = { jit: "", jid: "" };

export const updateExpiredToken = async (
  ctx: NextPageContext,
  guarded: boolean
): Promise<{ jit: string; jid: string }> => {
  const { jid = "" } = parseCookies(ctx);
  const { accessToken, refreshToken } = getInMemoryTokens(jid);

  if (accessToken.isValid) {
    console.log("refresh.almostExpires", refreshToken.almostExpires);
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
