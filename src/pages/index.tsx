import React from "react";

import { useUsersQuery } from "@/generated/graphql";
import { Layout } from "@/app/components/layouts/layout";
import { withApollo } from "@/app/lib/apollo_next";

let page = () => {
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

  return (
    <Layout title="Hello index page">
      {body}
    </Layout>
  );
};

export default withApollo(page);