import { RefreshToken } from "@/app/lib/auth/tokens/refresh_token";

let inMemoryRefreshToken = "";

export const setRefreshToken = (token = "") => {
  inMemoryRefreshToken = token;
};

export const getRefreshToken = () => new RefreshToken(inMemoryRefreshToken);
