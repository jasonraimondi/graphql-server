import React from "react";
import { NextPage } from "next";

import { withLayout } from "@/app/components/layouts/layout";

const Dashboard: NextPage = (props: any) => {
  return (
    <>
      <div>HELLO DASHBOARD</div>
      <div>decoded: {JSON.stringify(props)}</div>
    </>
  );
};

Dashboard.getInitialProps = async () => {
  console.log("dashboard get initial props");
  return {};
};

export default withLayout(Dashboard, {
  protectedRoute: true,
  title: "The Dashboard",
});
