import React from "react";
import { useAppVersionQuery, useUsersQuery } from "../generated/graphql";
import withApollo from "../lib/apollo";

const foo = () => {
  const appVersion = useAppVersionQuery();
  const { data, loading } = useUsersQuery();
  if (loading || !data) {
    return "loading..."
  }
  const {users} = data;
  return <div>
    <p>Version: {appVersion.data.version}</p>
    <ul>
      {users.map(user => <li>{user.email}</li>)}
    </ul>
  </div>
};

export default withApollo(foo)