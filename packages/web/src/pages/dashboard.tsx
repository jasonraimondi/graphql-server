import React from "react";
import { NextPage } from "next";

import { withLayout } from "@/app/components/layouts/layout";

const Dashboard: NextPage = () => {
  return (
    <>
      <div>HELLO DASHBOARD</div>
    </>
  );
};

export default withLayout(Dashboard, {
  protectedRoute: true,
  title: "The Dashboard",
});
