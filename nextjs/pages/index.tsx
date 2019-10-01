import React from "react";
import { useUsersQuery } from "../generated/graphql";
import withApollo from "../lib/apollo";

const foo = () => {
  const { data, loading } = useUsersQuery();
  if (loading || !data) {
    return "loading..."
  }

  return <p>Hi jason {JSON.stringify(data)}</p>
};

export default withApollo(foo)