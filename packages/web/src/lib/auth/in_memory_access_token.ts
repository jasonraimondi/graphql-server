import { AccessToken } from "@/app/lib/auth/tokens/access_token";

let inMemoryAccessToken = "";

export const setAccessToken = (token = "") => {
  inMemoryAccessToken = token;
};

export const getAccessToken = () => new AccessToken(inMemoryAccessToken);
