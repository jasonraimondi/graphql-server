import { FormikHelpers } from "formik";
import { NextPage } from "next";
import { withRouter } from "next/router";
import dynamic from "next/dynamic";
import { WithRouterProps } from "next/dist/client/with-router";
import React from "react";

import { withLayout } from "@/app/components/layouts/layout";
import { LoginFormData } from "@/app/components/forms/login_form";
import { AuthType } from "@/app/lib/auth/use_auth";

type Props = AuthType & WithRouterProps & {};

const LoginForm = dynamic(() => import("@/app/components/forms/login_form"), { ssr: false });

const LoginPage: NextPage<Props> = ({
  login,
  router: {
    query: { redirectTo },
  },
}) => {
  const handleSubmit = async (data: LoginFormData, { setSubmitting, setStatus }: FormikHelpers<LoginFormData>) => {
    try {
      await login(data);
      setSubmitting(false);
      if (!redirectTo || redirectTo.includes("/login")) {
        redirectTo = "/dashboard";
      } else if (Array.isArray(redirectTo)) {
        redirectTo = redirectTo[0];
      }
      (window as any).location = redirectTo;
    } catch (e) {
      setStatus(e.message);
    }
  };

  return (
    <>
      <h1 className="h5">Login Page</h1>
      <LoginForm handleSubmit={handleSubmit} />
    </>
  );
};

export default withLayout(withRouter(LoginPage), {
  title: "Login Page",
});
