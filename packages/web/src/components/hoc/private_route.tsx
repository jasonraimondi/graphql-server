import React, { useEffect } from "react";
import { NextPage, NextPageContext } from "next";

import { getAuth, setAccessToken, redirectToLogin, setRefreshToken } from "@/app/lib/auth";
import { fetchAccessToken } from "@/app/lib/token_refresh_link";

type Props = {
  jit?: string;
  jid?: string;
};

type RefreshTokenResponse = {
  success: boolean;
  accessToken: string;
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
    const auth = await getAuth(ctx);

    if (auth.accessToken.isExpired) {
      setAccessToken();

      if (auth.refreshToken.token === "") {
        await redirectToLogin(ctx);
        return {};
      }

      try {
        const data = await fetchAccessToken(ctx);
        const tokenResponse: RefreshTokenResponse = await data.json();

        if (!tokenResponse.success) {
          await redirectToLogin(ctx);
        }

        setAccessToken(tokenResponse.accessToken);
      } catch (e) {
        await redirectToLogin(ctx);
        return {};
      }
    }

    // Check if Page has a `getInitialProps`; if so, call it.
    const pageProps = WrappedComponent.getInitialProps && (await WrappedComponent.getInitialProps(ctx));
    return {
      ...pageProps,
      jit: auth.accessToken.token,
      jid: auth.refreshToken.token,
    };
  };

  return AuthenticatedRoute;
}
