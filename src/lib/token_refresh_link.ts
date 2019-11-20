import { TokenRefreshLink } from "apollo-link-token-refresh";
import jwtDecode from "jwt-decode";
import fetch from "isomorphic-unfetch";
import { getAccessToken, setAccessToken } from "@/app/lib/access_token";

import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig();

export const refreshLink = new TokenRefreshLink({
  accessTokenField: "accessToken",
  isTokenValidOrUndefined: () => {
    const token = getAccessToken();
    console.log("isTokenValidOrUndefined", { token });

    if (!token) {
      return true;
    }

    try {
      const { exp } = jwtDecode(token);
      if (Date.now() >= exp * 1000) {
        return false;
      } else {
        return true;
      }
    } catch {
      return false;
    }
  },
  fetchAccessToken: () => {
    console.log("fetch access token");
    return fetch(publicRuntimeConfig.REFRESH_TOKEN, {
      method: "POST",
      credentials: "include",
    });
  },
  handleFetch: accessToken => {
    console.log("handleFetch", { accessToken });
    setAccessToken(accessToken);
  },
  handleError: err => {
    console.warn("Your refresh token is invalid. Try to relogin");
    console.error(err);
  },
});