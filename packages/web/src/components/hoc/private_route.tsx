import React from "react";

import { destroyAccessToken, getAuth, setAccessToken } from "@/app/lib/auth";
import { NextPage, NextPageContext } from "next";
import { fetchAccessToken } from "@/app/lib/token_refresh_link";

export const COOKIES = {
  accessToken: "jid",
};

type Props = {
  accessToken?: string;
};

type RefreshTokenResponse = {
  success: boolean;
  accessToken: string;
};

export function privateRoute(WrappedComponent: NextPage<any>) {
  const AuthenticatedRoute: NextPage<Props> = (props: Props) => {
    return <WrappedComponent {...props} />;
  };

  AuthenticatedRoute.getInitialProps = async (ctx: NextPageContext) => {
    console.log("private route initial props start", ctx.req?.headers);
    const { accessToken, refreshToken } = await getAuth(ctx);
    console.log("auth route private route");
    console.log({ accessToken, refreshToken });

    if (accessToken.isExpired) {
      destroyAccessToken(ctx);

      if (!refreshToken || refreshToken.token === "") {
        console.log("REDIRECT TO LOGIN 1");
        // await redirectToLogin(ctx);
        // return {};
      } else {
        console.log("ELSE NO REFRESH");
      }

      try {
        const data = await fetchAccessToken();
        const tokenResponse: RefreshTokenResponse = await data.json();

        console.log("jason", { data, tokenResponse });

        if (!tokenResponse.success) {
          // await redirectToLogin(ctx);
          console.log("REDIRECT TO LOGIN 2");
        }

        setAccessToken(tokenResponse.accessToken, ctx);
        console.log("WOW IT WORKED");
      } catch (e) {
        console.log("CAUGHT EM");
        // console.log(e);
      }
    }

    // Check if Page has a `getInitialProps`; if so, call it.
    const pageProps = WrappedComponent.getInitialProps && (await WrappedComponent.getInitialProps(ctx));

    // Return props.
    return { ...pageProps };
  };

  return AuthenticatedRoute;
}
