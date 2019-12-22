import React from "react";
import { NextPage, NextPageContext } from "next";

import { updateExpiredToken } from "@/app/lib/update_expired_token";
import { useAuth } from "@/app/lib/auth/use_auth";
import { parseCookies } from "nookies";
import { getAccessToken } from "@/app/lib/auth/in_memory_access_token";
// import { isServer } from "@/app/lib/auth";

type Props = {
  jit?: string;
  jid?: string;
};

export function withAuth(WrappedComponent: NextPage<any>, guarded = false) {
  const AuthenticatedRoute: NextPage<Props> = (props: Props) => {
    const auth = useAuth(props);
    return <WrappedComponent auth={auth} {...props} />;
  };

  AuthenticatedRoute.getInitialProps = async (ctx: NextPageContext) => {
    console.log("authenticated get initial props start");

    // if (isServer()) {
    const { jid = "" } = parseCookies(ctx);
    const { jit } = await updateExpiredToken(guarded, jid);
    // }

    if (guarded && getAccessToken().isExpired) {
      // await redirectToLogin(ctx);
      console.log("REDIRECT TO LOGIN");
    }

    return {
      ...(WrappedComponent.getInitialProps && (await WrappedComponent.getInitialProps(ctx))),
      jit,
      jid,
    };
  };

  return AuthenticatedRoute;
}
