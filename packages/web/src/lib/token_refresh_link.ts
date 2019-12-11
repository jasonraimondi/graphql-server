import { TokenRefreshLink } from "apollo-link-token-refresh";
import fetch from "isomorphic-unfetch";

import getConfig from "next/config";
// import { setAccessToken } from "@/app/lib/auth";

const {
  publicRuntimeConfig: { REFRESH_TOKEN_URL },
} = getConfig();

export const fetchAccessToken = () => {
  return fetch(REFRESH_TOKEN_URL, {
    method: "POST",
    credentials: "include",
  });
};

export const refreshLink = new TokenRefreshLink({
  accessTokenField: "accessToken",
  isTokenValidOrUndefined: () => {
    // const { accessToken: { isExpired } } = getAuth();
    // @todo this is borked now
    return true;
  },
  fetchAccessToken: fetchAccessToken,
  handleFetch: accessToken => {
    console.log("handleFetch", accessToken);
    // setAccessToken(accessToken);
  },
  handleError: err => {
    console.error("Your refresh token is invalid. Try to relogin");
    console.error(err);
  },
});
