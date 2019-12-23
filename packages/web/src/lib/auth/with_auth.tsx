import React from "react";
import { NextPage, NextPageContext } from "next";
import { parseCookies } from "nookies";

import { updateExpiredToken } from "@/app/lib/auth/update_expired_token";
import { useAuth } from "@/app/lib/auth/use_auth";
import { setRefreshToken } from "@/app/lib/auth/in_memory_refresh_token";
import { redirectToLogin } from "@/app/lib/redirect";
import { getInMemoryTokens } from "@/app/lib/auth/in_memory";
// import {getInMemoryTokens} from "@/app/lib/auth/in_memory";

type Props = {
  jit: string;
  jid: string;
  isServer: boolean;
};

export function withAuth(WrappedComponent: NextPage<any>, guarded = false) {
  const AuthenticatedRoute: NextPage<Props> = (props: Props) => {
    const auth = useAuth(props); // USE AUTH NEEDS TO UPDATE AFTER TOKEN REFRESH

    console.log("isServer", props.isServer);
    console.log("AuthenticatedRoute", getInMemoryTokens());

    return <WrappedComponent auth={auth.auth} {...props} />;
  };

  AuthenticatedRoute.getInitialProps = async (ctx: NextPageContext) => {
    const isServer = !!ctx.req;

    if (isServer) {
      const { jid = "" } = parseCookies(ctx);
      setRefreshToken(jid);
      console.log("setRefreshToken", { isServer, jid });
    }

    const { accessToken, refreshToken } = await updateExpiredToken();

    if (guarded && accessToken.isExpired) {
      await redirectToLogin(ctx);
      // console.log("REDIRECT TO LOGIN");
    }

    return {
      ...(WrappedComponent.getInitialProps && (await WrappedComponent.getInitialProps(ctx))),
      jit: accessToken.token,
      jid: refreshToken.token,
      isServer,
    };
  };

  return AuthenticatedRoute;
}
