import { setAccessToken } from "@/app/lib/auth/in_memory_access_token";
import { fetchAccessToken } from "@/app/lib/apollo_token_refresh_link";
import { AuthTokens, getInMemoryTokens } from "@/app/lib/auth/in_memory";

type RefreshTokenResponse = {
  success: boolean;
  accessToken: string;
};

export const updateExpiredToken = async (): Promise<AuthTokens> => {
  console.log("updateExpiredToken");

  const { accessToken, refreshToken } = getInMemoryTokens();
  if (accessToken.isValid) {
    console.log("refresh almost expires", refreshToken.expiresAt, refreshToken.almostExpires, refreshToken.isExpired);
    return { accessToken, refreshToken };
  }

  setAccessToken("");

  if (refreshToken.token === "") {
    console.log("REFRESH TOKEN EMPTY");
    return getInMemoryTokens();
  }

  console.log(`jid=${refreshToken.token}`);

  const updatedAccessToken: RefreshTokenResponse = await fetchAccessToken(`jid=${refreshToken.token}`);
  console.log(refreshToken.token, refreshToken.isExpired);

  if (!updatedAccessToken.success) {
    console.log("UPDATED NOT SUCCESS", getInMemoryTokens());
    return getInMemoryTokens();
  }

  setAccessToken(updatedAccessToken.accessToken);

  console.log("UPDATED SUCCESS", getInMemoryTokens());
  return getInMemoryTokens();
};
