import { NextPage } from "next";
import Router from "next/router";
import React from "react";

import { useLoginMutation } from "@/generated/graphql";
import { withApollo } from "@/app/lib/apollo_next";
import { validEmail } from "@/app/pages/register";
import { setAccessToken } from "@/app/lib/auth";
import { withLayout } from "@/app/components/layouts/layout";
import { LoginForm, LoginFormData } from "@/app/components/forms/login_form";

type Props = {
  redirectTo?: string;
}

const LoginPage: NextPage<Props> = ({ redirectTo }) => {
  const [login] = useLoginMutation();

  const handleSubmit = async (data: LoginFormData, { setSubmitting }: any) => {
    const response = await login({
      variables: { data },
    });
    if (response && response.data) {
      setAccessToken(response.data.login.accessToken);
    }
    setSubmitting(false);
    if (!redirectTo || redirectTo.includes("/login")) redirectTo = "/dashboard";
    await Router.push(redirectTo);
  };

  const handleValidate = (values: LoginFormData) => {
    let errors: any = {};
    if (!values.email) {
      errors.email = "Required";
    } else if (!validEmail.test(values.email)) {
      errors.email = "Invalid email address";
    }
    return errors;
  };

  return <>
    <h1 className="h5">Login Page</h1>
    <LoginForm handleSubmit={handleSubmit} handleValidate={handleValidate}/>
  </>;
};

LoginPage.getInitialProps = async (ctx) => {
  let { redirectTo } = ctx.query;
  return { redirectTo: redirectTo ? redirectTo.toString() : undefined };
};

export default withLayout(withApollo(LoginPage));