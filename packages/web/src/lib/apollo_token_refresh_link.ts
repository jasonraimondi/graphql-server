import { TokenRefreshLink } from "apollo-link-token-refresh";

import { setAccessToken } from "@/app/lib/auth/in_memory_access_token";
import { getAuth } from "@/app/lib/auth";
import client from "@/app/lib/api_client";

export const fetchAccessToken = (ctx: any) => {
  return client("/auth/refresh_token", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      cookie: ctx?.req?.headers?.cookie ?? "",
    },
  });
};

export const refreshLink = new TokenRefreshLink({
  accessTokenField: "accessToken",
  isTokenValidOrUndefined: () => {
    console.log(getAuth());
    return true;
  },
  fetchAccessToken: fetchAccessToken,
  handleFetch: accessToken => {
    console.log("handleFetch", accessToken);
    setAccessToken(accessToken);
  },
  handleError: err => {
    console.error("Your refresh token is invalid. Try to relogin");
    console.error(err);
  },
});