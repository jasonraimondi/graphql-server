import { RefreshToken } from "@/app/lib/auth/tokens/refresh_token";

let inMemoryRefreshToken = "";

/**
 * @deprecated
 * @param token
 */
export const setRefreshToken = (token = "") => {
  inMemoryRefreshToken = token;
};

/**
 * @deprecated
 */
export const getRefreshToken = () => new RefreshToken(inMemoryRefreshToken);
