import { NextPage } from "next";
import * as React from "react";
import Head from "next/head";
import { css } from "emotion";
import "normalize.css/normalize.css";

import { Header } from "@/app/components/layouts/partials/header";
import { colors } from "@/styles/theme";
import { withAuth } from "@/app/components/hoc/with_auth";
import { getInMemoryTokens } from "@/app/lib/auth";
import { parseCookies } from "nookies";
import { useAuth } from "@/app/lib/hooks/use_auth";

type Props = {
  jit: string;
  jid: string;
};

type Settings = {
  protectedRoute?: boolean;
  title?: string;
};

export const withLayout = (WrappedComponent: NextPage<any>, settings?: Settings) => {
  settings = {
    protectedRoute: false,
    title: "Default Page Title",
    ...settings,
  };
  const { protectedRoute, title } = settings;

  const Layout: NextPage<Props> = (props) => {
    const auth = useAuth(props);

    return (
      <React.StrictMode>
        <Head>
          <title>{title}</title>
          <meta charSet="utf-8" />
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        <main
          className={css`
            height: 100%;
            display: flex;
            flex-direction: column;
            color: ${colors.black};
            background-color: ${colors.blue["500"]};
          `}
        >
          <Header auth={auth} />
          <div
            className={css`
              flex: 1;
              color: ${colors.black};
              background-color: ${colors.blue["300"]};
            `}
          >
            <WrappedComponent auth={auth} {...props} />
            <p>Auth: {JSON.stringify("auth")}</p>
          </div>
        </main>
      </React.StrictMode>
    );
  };

  Layout.getInitialProps = async ctx => {
    const { jid } = parseCookies(ctx);
    const auth = getInMemoryTokens(jid);

    return {
      ...(WrappedComponent.getInitialProps && (await WrappedComponent.getInitialProps(ctx))),
      jit: auth.accessToken.token,
      jid: auth.refreshToken.token,
    };
  };

  if (protectedRoute) {
    return withAuth(Layout, true);
  }

  return withAuth(Layout);
};
