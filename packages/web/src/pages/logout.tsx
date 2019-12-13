import { NextPage } from "next";
import React, { useEffect } from "react";

import { useLogoutMutation } from "@/generated/graphql";
import { withLayout } from "@/app/components/layouts/layout";
import { destroyAccessToken } from "@/app/lib/auth";
import { Redirect } from "@/app/lib/redirect";

const Logout: NextPage = () => {
  const [logout, { client }] = useLogoutMutation();

  const handleLogout = async () => {
    await logout();
    await client!.resetStore();
    destroyAccessToken();
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
