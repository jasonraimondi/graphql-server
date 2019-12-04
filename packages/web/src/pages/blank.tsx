import React from "react";
import { NextPage } from "next";
import { withLayout } from "@/app/components/layouts/layout";

const Dashboard: NextPage = () => {
  return <div>I'm a simple layout</div>;
};

export default withLayout(Dashboard, {
  protectedRoute: true,
  title: "I'm a little teapot",
});
