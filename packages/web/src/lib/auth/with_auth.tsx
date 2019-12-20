import React from "react";
import { NextPage, NextPageContext } from "next";

import { updateExpiredToken } from "@/app/lib/update_expired_token";
import { redirectToLogin } from "@/app/lib/redirect";

type Props = {
  jit?: string;
  jid?: string;
};

export function withAuth(WrappedComponent: NextPage<any>, guarded = false) {
  const AuthenticatedRoute: NextPage<Props> = (props: Props) => {
    return <WrappedComponent {...props} />;
  };

  AuthenticatedRoute.getInitialProps = async (ctx: NextPageContext) => {
    console.log("authenticated get initial props start");
    const { jit, jid } = await updateExpiredToken(ctx, guarded);

    if (guarded && jit === "") {
      await redirectToLogin(ctx);
    }

    return {
      ...(WrappedComponent.getInitialProps && (await WrappedComponent.getInitialProps(ctx))),
      jit,
      jid,
    };
  };

  return AuthenticatedRoute;
}
