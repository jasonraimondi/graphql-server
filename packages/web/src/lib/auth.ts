import { parseCookies } from "nookies";
import { NextPageContext } from "next";

import { RefreshToken } from "@/app/lib/auth/refresh_token";
import { AccessToken } from "@/app/lib/auth/access_token";
import { Redirect } from "@/app/lib/redirect";

type Auth = {
  accessToken: AccessToken;
  refreshToken: RefreshToken;
};

let inMemoryAccessToken = new AccessToken("");

export const setAccessToken = (token?: string) => {
  inMemoryAccessToken = new AccessToken(token ?? "");
};

let inMemoryRefreshToken = new RefreshToken("");

export const setRefreshToken = (token?: string) => {
  inMemoryRefreshToken = new RefreshToken(token ?? "");
};

const isServer = () => typeof window === "undefined";

export const getAuth = (ctx?: NextPageContext): Auth => {
  const { jid } = parseCookies(ctx);
  if (isServer()) {
    console.log("IS SERVER JID");
    setRefreshToken(jid);
  }
  return {
    accessToken: inMemoryAccessToken,
    refreshToken: inMemoryRefreshToken,
  };
};

export async function redirectToLogin(ctx?: NextPageContext, doNotRedirectBack = false) {
  let redirectLink = ctx?.pathname ?? document.referrer;

  if (redirectLink) {
    redirectLink = `?redirectTo=${encodeURI(redirectLink)}`;
  }

  if (doNotRedirectBack) {
    redirectLink = "";
  }

  await Redirect(`/login${redirectLink}`, ctx);
}

/** @deprecated */
export type DeprecatedAuth = {
  email?: string;
};
