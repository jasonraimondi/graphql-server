import { NextPage } from "next";
import React, { useEffect } from "react";

import { useLogoutMutation } from "@/generated/graphql";
import { withLayout } from "@/app/components/layouts/layout";
import { Redirect } from "@/app/lib/redirect";
import { setAccessToken } from "@/app/lib/auth/in_memory_access_token";
import { setRefreshToken } from "@/app/lib/auth/in_memory_refresh_token";

const Logout: NextPage = () => {
  const [logout, { client }] = useLogoutMutation();

  const handleLogout = async () => {
    await logout();
    await client!.resetStore();
    setAccessToken();
    setRefreshToken();
    await Redirect("/login");
  };

  useEffect(() => {
    handleLogout().catch(e => console.error(e));
  }, []);

  return <h1>Logging Out...</h1>;
};

export default withLayout(Logout, {
  title: "Logout Page",
});
