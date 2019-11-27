import React from "react";
import { NextPage } from "next";

import { withLayout } from "@/app/components/layouts/layout";
import { AccessToken } from "@/app/lib/auth/access_token";

const Dashboard: NextPage = ({ accessToken }: any) => {
  const token = new AccessToken(accessToken);
  return <>
    <div>HELLO DASHBOARD</div>
    <div>decoded: {JSON.stringify(token)}</div>
  </>;
};

export default withLayout(Dashboard, {
  protectedRoute: true,
});
