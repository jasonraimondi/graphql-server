import * as React from "react";
import Head from "next/head";

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

  return <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8"/>
      <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
    </Head>
    <Header/>
    {children}
  </div>;
};
