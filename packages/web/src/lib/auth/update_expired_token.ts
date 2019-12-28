import { setAccessToken } from "@/app/lib/auth/in_memory_access_token";
import { refreshAccessToken } from "@/app/lib/apollo_token_refresh_link";
import { AuthTokens, getInMemoryTokens } from "@/app/lib/auth/in_memory";

type RefreshTokenResponse = {
  success: boolean;
  accessToken: string;
};

export const updateExpiredToken = async (): Promise<AuthTokens> => {
  const { accessToken, refreshToken } = getInMemoryTokens();

  if (accessToken.isValid) {
    return { accessToken, refreshToken };
  }

  setAccessToken();

  if (refreshToken.isExpired) {
    return getInMemoryTokens();
  }

  const updatedAccessToken: RefreshTokenResponse = await refreshAccessToken(`jid=${refreshToken.token}`);

  if (!updatedAccessToken.success) {
    return getInMemoryTokens();
  }

  setAccessToken(updatedAccessToken.accessToken);

  return getInMemoryTokens();
};
