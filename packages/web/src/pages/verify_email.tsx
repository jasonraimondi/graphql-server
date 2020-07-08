import { NextPage } from "next";
import { withRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { withLayout } from "@/app/components/layouts/layout";
import { Redirect } from "@/app/lib/redirect";
import { WithRouterProps } from "next/dist/client/with-router";
import { apiSDK } from "@/app/lib/api_sdk";

type Props = WithRouterProps & {};

const VerifyUser: NextPage<Props> = ({
  router: {
    query: { e, u },
  },
}) => {
  const email = Array.isArray(e) ? e[0] : e;
  const uuid = Array.isArray(u) ? u[0] : u;
  const verifyEmailData = { email, uuid };
  const [status, setStatus] = useState("Verifying Email...");

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleVerifyUser = async () => {
    await apiSDK.VerifyEmailConfirmation({ data: verifyEmailData }).catch(e => {
      setStatus(e.message);
      Redirect(`/login?message=${encodeURI(e.message)}`);
    });
    setStatus("Success! Redirecting to login...");
    await sleep(750);
    await Redirect("/login");
  };

  useEffect(() => {
    handleVerifyUser().catch(e => console.error(e));
  }, []);

  return <h1 className="h5">{status}</h1>;
};

export default withLayout(withRouter(VerifyUser), {
  title: "VerifyUser Page",
});
