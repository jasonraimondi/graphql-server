import React from "react";
import { NextPage } from "next";

import { useUsersQuery } from "@/generated/graphql";
import { withLayout } from "@/app/components/layouts/layout";
import { withApollo } from "@/app/lib/apollo_next";

const Index: NextPage<any> = () => {
  const { data } = useUsersQuery({ fetchPolicy: "network-only" });
  let body;
  if (!data) {
    body = <>loading...</>;
  } else {
    body = <>
      <p>users:</p>
      <ul>
        {data.users.map(x => {
          return (
            <li key={x.uuid}>
              {x.email}, {x.uuid}
            </li>
          );
        })}
      </ul>
    </>;
  }

  return <div>{body}</div>;
};

export default withLayout(withApollo(Index));