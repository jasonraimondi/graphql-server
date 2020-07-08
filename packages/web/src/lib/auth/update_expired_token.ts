import client from "@/app/lib/client";

import { AccessToken } from "@/app/lib/auth/tokens/access_token";
import { RefreshToken } from "@/app/lib/auth/tokens/refresh_token";

type RefreshTokenResponse = {
  success: boolean;
  accessToken: string;
};

const refreshAccessToken = (cookie = "") => {
  return client("/auth/refresh_token", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      cookie,
    },
  });
};

export const updateExpiredToken = async (jid = "", jit = ""): Promise<string> => {
  let accessToken = new AccessToken(jit);
  let refreshToken = new RefreshToken(jid);

  if (accessToken.isValid) {
    return "";
  }

  if (refreshToken.isExpired) {
    return "";
  }

  const updatedAccessToken: RefreshTokenResponse = await refreshAccessToken(`jid=${refreshToken.token}`);

  if (!updatedAccessToken.success) {
    return "";
  }

  return updatedAccessToken.accessToken;
};
