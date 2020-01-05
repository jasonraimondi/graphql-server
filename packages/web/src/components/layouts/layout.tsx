import { NextPage } from "next";
import * as React from "react";
import Head from "next/head";
import { css } from "emotion";
import "normalize.css/normalize.css";

import { Header } from "@/app/components/layouts/partials/header";
import { colors } from "@/styles/theme";
import { AuthTokens } from "@/app/lib/auth/in_memory";
import { withAuth } from "@/app/lib/auth/with_auth";
import { Token } from "@/app/components/token";

type LayoutProps = {
  auth: AuthTokens;
};

type Settings = {
  protectedRoute?: boolean;
  title?: string;
};

export const withLayout = (
  WrappedComponent: NextPage<any>,
  { title = "Default Page Title", protectedRoute = false }: Settings
) => {
  const Layout: NextPage<LayoutProps> = (props: LayoutProps) => {
    return (
      <React.StrictMode>
        <Head>
          <title>{title}</title>
          <meta charSet="utf-8" />
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="manifest" href="/site.webmanifest" />
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
          <Header auth={props.auth} />
          <div
            className={css`
              flex: 1;
              color: ${colors.black};
              background-color: ${colors.blue["300"]};
            `}
          >
            <Token accessToken={props.auth.accessToken} refreshToken={props.auth.refreshToken} />
            <WrappedComponent {...props} />
          </div>
        </main>
      </React.StrictMode>
    );
  };

  return withAuth(Layout, protectedRoute);
};
