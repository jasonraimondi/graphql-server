import React from "react";
import { NextPage } from "next";

import { withLayout } from "@/app/components/layouts/layout";
import { useMeQuery } from "@/generated/graphql";

const Dashboard: NextPage = () => {
  const { data, loading, error } = useMeQuery({ fetchPolicy: "network-only" });
  // console.log({ data, loading, error });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error {JSON.stringify(error)}</div>;
  }

  if (data) {
    const { me } = data;
    return (
      <div>
        <p>{me.uuid}</p>
        <p>{me.email}</p>
        <p>{me.name}</p>
      </div>
    );
  }

  return <div>Something went wrong!</div>;
};

export default withLayout(Dashboard, {
  protectedRoute: true,
  title: "User profile",
});
