import React, { useEffect } from "react";
import { NextPage, NextPageContext } from "next";
import { parseCookies } from "nookies";

import { updateExpiredToken } from "@/app/lib/auth/update_expired_token";
import { useAuth } from "@/app/lib/auth/use_auth";
import { redirectToLogin } from "@/app/lib/redirect";
import { AccessToken } from "@/app/lib/auth/tokens/access_token";

type Props = {
  jit: string;
  jid: string;
  isServer: boolean;
};

export function withAuth(WrappedComponent: NextPage<any>, guarded = false) {
  const AuthenticatedRoute: NextPage<Props> = ({ jit, jid, isServer, ...props }: Props) => {
    const { setAuth, accessToken, ...auth } = useAuth();
    useEffect(() => {
      if (isServer) {
        setAuth({ jit, jid });
      }
    }, [accessToken.authorizationString]);

    return <WrappedComponent accessToken={accessToken} {...auth} {...props} />;
  };

  AuthenticatedRoute.getInitialProps = async (ctx: NextPageContext) => {
    const isServer = !!ctx.req;

    if (isServer) {
      const { jid = "" } = parseCookies(ctx);
      const accessToken = new AccessToken(await updateExpiredToken(jid));

      if (guarded && accessToken.isExpired) {
        await redirectToLogin(ctx);
      }

      return {
        ...(WrappedComponent.getInitialProps && (await WrappedComponent.getInitialProps(ctx))),
        jit: accessToken.token,
        jid,
        isServer,
      };
    }

    return {
      ...(WrappedComponent.getInitialProps && (await WrappedComponent.getInitialProps(ctx))),
      isServer,
    };
  };

  return AuthenticatedRoute;
}
