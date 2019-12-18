import { NextPage } from "next";
import * as React from "react";
import Head from "next/head";
import { css } from "emotion";
import "normalize.css/normalize.css";

import { Header } from "@/app/components/layouts/partials/header";
import { colors } from "@/styles/theme";
import { privateRoute } from "@/app/components/hoc/private_route";
import { getAuth } from "@/app/lib/auth";
import { parseCookies } from "nookies";

type Props = {};

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
  const { accessToken } = getAuth();
  const { protectedRoute, title } = settings;

  const Layout: NextPage<Props> = props => {
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
          <Header />
          <div
            className={css`
              flex: 1;
              color: ${colors.black};
              background-color: ${colors.blue["300"]};
            `}
          >
            <WrappedComponent {...props} className="blue" />
            <p>
              Auth: {accessToken?.decoded?.email ? "true" : "false"} {JSON.stringify(accessToken)}
            </p>
          </div>
        </main>
      </React.StrictMode>
    );
  };

  Layout.getInitialProps = async ctx => {
    const { jid } = parseCookies(ctx);
    const auth = getAuth(jid);

    return {
      ...(WrappedComponent.getInitialProps && (await WrappedComponent.getInitialProps(ctx))),
      jit: auth.accessToken.token,
      jid: auth.refreshToken.token,
    };
  };

  if (protectedRoute) {
    return privateRoute(Layout);
  }

  return Layout;
};
