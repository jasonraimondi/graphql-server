import React, { useEffect } from "react";
import { NextPage, GetServerSideProps, GetServerSidePropsContext } from "next";
import { parseCookies } from "nookies";

import { updateExpiredToken } from "@/app/lib/auth/update_expired_token";
import { useAuth } from "@/app/lib/auth/use_auth";
import { AccessToken } from "@/app/lib/auth/tokens/access_token";

type Props = {
  jit: string;
  jid: string;
  isServer: boolean;
};

export function withAuth(WrappedComponent: NextPage<any>) {
  const AuthenticatedRoute = ({ jit, jid, isServer, ...props }: Props) => {
    const { setAuth, accessToken, ...auth } = useAuth();
    useEffect(() => {
      if (isServer) {
        setAuth({ jit, jid });
      }
    }, [accessToken.authorizationString]);

    return <WrappedComponent accessToken={accessToken} {...auth} {...props} />;
  };
  return AuthenticatedRoute;
}

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext, guarded = false) => {
  const { jid = "" } = parseCookies(ctx);
  const accessToken = new AccessToken(await updateExpiredToken(jid));

  if (guarded && accessToken.isExpired) {
    ctx.res.writeHead(303, { Location: "/helphelp" });
    ctx.res.end();
  }

  return {
    props: {
      jit: accessToken.token,
      jid,
    }
  };
};