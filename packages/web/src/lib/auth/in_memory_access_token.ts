import { AccessToken } from "@/app/lib/auth/access_token";

let inMemoryAccessToken = "";

export const setAccessToken = (token?: string) => {
  inMemoryAccessToken = token ?? "";
};

export const getAccessToken = () => {
  return new AccessToken(inMemoryAccessToken);
};
