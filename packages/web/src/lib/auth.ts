import { RefreshToken } from "@/app/lib/auth/refresh_token";
import { AccessToken } from "@/app/lib/auth/access_token";
import { getRefreshToken, setRefreshToken } from "@/app/lib/auth/in_memory_refresh_token";
import { getAccessToken } from "@/app/lib/auth/in_memory_access_token";

export type Auth = {
  accessToken: AccessToken;
  refreshToken: RefreshToken;
};

const isServer = () => typeof window === "undefined";

export const getInMemoryTokens = (jid = ""): Auth => {
  if (isServer()) {
    setRefreshToken(jid);
  }
  return {
    accessToken: getAccessToken(),
    refreshToken: getRefreshToken(),
  };
};
