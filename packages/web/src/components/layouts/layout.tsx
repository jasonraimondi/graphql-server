import * as React from "react";
import Head from "next/head";
import { css } from "emotion";
import "normalize.css/normalize.css";
import baseStyles from "@/styles/base";

import { Header } from "@/app/components/layouts/partials/header";
import { colors } from "@/styles/theme";
import { NextPage, NextPageContext } from "next";
import { AccessToken } from "@/app/lib/auth/access_token";
import { getAuth } from "@/app/lib/auth";
import { privateRoute } from "@/app/components/hoc/private_route";

type Props = {
  accessToken?: string;
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
    const auth = new AccessToken(props.accessToken);

    return <React.StrictMode>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8"/>
        <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
        {baseStyles}
      </Head>
      <main className={css`
        height: 100%;
        display: flex;
        flex-direction: column;
        color: ${colors.black};
        background-color: ${colors.blue["500"]};
      `}>
        <Header auth={auth.decoded}/>
        <div className={css`
        flex: 1;
        color: ${colors.black};
        background-color: ${colors.blue["300"]};
      `}>
          {/* todo refactor optional chaining*/}
          <WrappedComponent {...props} className="blue" />
          <p>Auth: {auth && auth.decoded && auth.decoded.email ? "true" : "false"} {JSON.stringify(auth)}</p>
        </div>
      </main>
    </React.StrictMode>;
  };

  Layout.getInitialProps = async (ctx: NextPageContext) => {
    const { accessToken } = await getAuth(ctx);
    return {
      ...(WrappedComponent.getInitialProps && await WrappedComponent.getInitialProps(ctx)),
      accessToken: accessToken.token,
    };
  };

  if (protectedRoute) {
    return privateRoute(Layout);
  }

  return Layout;
};
