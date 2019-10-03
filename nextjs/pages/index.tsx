import React from "react";

import { useUsersQuery } from "../generated/graphql";
import { withApollo } from "../lib/apollo";

const foo = () => {
  const { data, loading } = useUsersQuery();
  if (loading || !data) {
    return "loading..."
  }
  const {users} = data;
  return <div>
    <ul>
      {users.map((user) => <li key={user.uuid}>{user.email}</li>)}
    </ul>
  </div>
};

export default withApollo(foo)