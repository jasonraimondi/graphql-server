import React from "react";
import { useUsersQuery } from "../generated/graphql";
import withApollo from "../lib/apollo";

const foo = () => {
  const { data, loading } = useUsersQuery();
  if (loading || !data) {
    return "loading..."
  }
  const {users} = data;
  console.log(users);
  return <ul>
    {users.map(user => <li>{user.email}</li>)}
  </ul>
};

export default withApollo(foo)