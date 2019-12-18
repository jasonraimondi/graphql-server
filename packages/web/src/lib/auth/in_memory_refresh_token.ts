import { RefreshToken } from "@/app/lib/auth/refresh_token";

let inMemoryRefreshToken = "";

export const setRefreshToken = (token?: string) => {
  inMemoryRefreshToken = token ?? "";
};

export const getRefreshToken = () => new RefreshToken(inMemoryRefreshToken);
