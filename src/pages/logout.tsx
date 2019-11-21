import React from "react";

// import { useLogoutMutation } from "@/generated/graphql";
import { Layout } from "@/app/components/layouts/layout";
import { withApollo } from "@/app/lib/apollo_next";

const page = () => {
  // const [logout, { client }] = useLogoutMutation();
  // const handleLogout = async () => {
  //   alert("log the user out!");
  //   await logout();
  //   setAccessToken("");
  //   await client!.resetStore();
  // };

  return (
    <Layout title="This is the logout page">
      <div>Bye soon</div>
    </Layout>
  );
};

export default withApollo(page);
