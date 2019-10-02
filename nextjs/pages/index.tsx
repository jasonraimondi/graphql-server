import React from "react";

import {useUsersQuery} from "@/generated/graphql";

const foo = () => {
  const { data, loading } = useUsersQuery();
  if (loading || !data) {
    return "loading..."
  }
  const {users} = data;
  return <div>
    <ul>
      {users.map((user: any) => <li>{user.email}</li>)}
    </ul>
  </div>
};

export default withApollo(foo)