import { AccessToken } from "@/app/lib/auth/tokens/access_token";

let inMemoryAccessToken = "";

/**
 * @deprecated
 * @param token
 */
export const setAccessToken = (token = "") => {
  inMemoryAccessToken = token;
};

/**
 * @deprecated
 */
export const getAccessToken = () => new AccessToken(inMemoryAccessToken);
