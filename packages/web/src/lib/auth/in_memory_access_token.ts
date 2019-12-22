import { AccessToken } from "@/app/lib/auth/access_token";

let inMemoryAccessToken = "";

export const setAccessToken = (token = "") => {
  console.log("setAccessToken is active", token !== "", token);
  inMemoryAccessToken = token;
};

export const getAccessToken = () => {
  return new AccessToken(inMemoryAccessToken);
};
