import { RefreshToken } from "@/app/lib/auth/tokens/refresh_token";
import { AccessToken } from "@/app/lib/auth/tokens/access_token";
import { getRefreshToken } from "@/app/lib/auth/in_memory_refresh_token";
import { getAccessToken } from "@/app/lib/auth/in_memory_access_token";

export type AuthTokens = {
  accessToken: AccessToken;
  refreshToken: RefreshToken;
};

/**
 * @deprecated
 */
export const getInMemoryTokens = (): AuthTokens => {
  return {
    accessToken: getAccessToken(),
    refreshToken: getRefreshToken(),
  };
};
