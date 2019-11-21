import * as React from "react";
import Head from "next/head";
import { css } from 'emotion'

import { Header } from "@/app/components/layouts/partials/header";

type Props = {
  title?: string;
};

export const Layout: React.FunctionComponent<Props> = ({ children, title = "TypeScript GraphQL - by Jason Raimondi" }) => {
  // const [logout, { client }] = useLogoutMutation();
  // const handleLogout = async () => {
  //   alert("log the user out!");
  //   await logout();
  //   setAccessToken("");
  //   await client!.resetStore();
  // };

  return <>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8"/>
      <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
    </Head>
    <Header/>
    <main className={css`
      height: 100%;
      background-color: tomato;
    `}>
      {children}
    </main>
  </>;
};
