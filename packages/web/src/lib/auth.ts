import { destroyCookie, parseCookies, setCookie } from "nookies";
import { NextPageContext } from "next";
import { RefreshToken } from "@/app/lib/auth/refresh_token";
import { AccessToken } from "@/app/lib/auth/access_token";
import { Redirect } from "@/app/lib/redirect";

type Auth = {
  accessToken: AccessToken;
  refreshToken?: RefreshToken;
}


export const destroyAccessToken = (ctx?: NextPageContext) => {
  console.log("DESTROY ACCESS TOKEN");
  destroyCookie(ctx, "jit");
};

export const setAccessToken = (token: string, ctx?: NextPageContext) => {
  console.log("SET ACCESS TOKEN", token);
  setCookie(ctx, "jit", token, {
    maxAge: 60 * 60 * 24,
    path: "/"
  });
};

export const getAuth = async (ctx?: NextPageContext): Promise<Auth> => {
  const { jid, jit } = parseCookies(ctx);
  return {
    accessToken: new AccessToken(jit),
    refreshToken: new RefreshToken(jid)
  };
};

// @ts-ignore
export async function redirectToLogin(ctx?: NextPageContext) {
  const redirectTo = ctx && ctx.pathname ? ctx.pathname : document.referrer;
  console.log({ redirectTo });
  await Redirect(redirectTo ? `/login?redirectTo=${encodeURI(redirectTo)}` : "/login", ctx);
}

export type DeprecatedAuth = {
  email?: string;
}