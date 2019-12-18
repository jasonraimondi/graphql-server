import React, { useEffect } from "react";
import { NextPage, NextPageContext } from "next";

import { getAuth } from "@/app/lib/auth";
import { fetchAccessToken } from "@/app/lib/apollo_token_refresh_link";
import { parseCookies } from "nookies";
import { setRefreshToken } from "@/app/lib/auth/in_memory_refresh_token";
import { setAccessToken } from "@/app/lib/auth/in_memory_access_token";

type Props = {
  jit?: string;
  jid?: string;
};

type RefreshTokenResponse = {
  success: boolean;
  accessToken: string;
};

const updateExpiredToken = async (ctx: NextPageContext) => {
  const { jid = "" } = parseCookies(ctx);
  const { accessToken, refreshToken } = getAuth(jid);

  if (accessToken.isValid) {
    return {
      jit: accessToken.token,
      jid: refreshToken.token,
    };
  }

  setAccessToken("");

  if (refreshToken.token === "") {
    return {};
  }
  const updatedRefreshToken: RefreshTokenResponse = await fetchAccessToken(ctx);

  if (!updatedRefreshToken.success) {
    return {};
  }

  setAccessToken(updatedRefreshToken.accessToken);

  return {
    jit: updatedRefreshToken.accessToken,
    jid,
  };
};

export function privateRoute(WrappedComponent: NextPage<any>) {
  const AuthenticatedRoute: NextPage<Props> = (props: Props) => {
    useEffect(() => {
      setAccessToken(props.jit);
      setRefreshToken(props.jid);
    });
    return <WrappedComponent {...props} />;
  };

  AuthenticatedRoute.getInitialProps = async (ctx: NextPageContext) => {
    const result = await updateExpiredToken(ctx);
    const pageProps = WrappedComponent.getInitialProps && (await WrappedComponent.getInitialProps(ctx));
    return {
      ...result,
      ...pageProps,
    };
  };

  return AuthenticatedRoute;
}
