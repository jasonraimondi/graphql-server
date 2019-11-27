import { NextPage } from "next";
import { withRouter } from "next/router";
import React from "react";

import { useLoginMutation } from "@/generated/graphql";
import { withApollo } from "@/app/lib/apollo_next";
import { validEmail } from "@/app/pages/register";
import { setAccessToken } from "@/app/lib/auth";
import { withLayout } from "@/app/components/layouts/layout";
import { LoginForm, LoginFormData } from "@/app/components/forms/login_form";
import { WithRouterProps } from "next/dist/client/with-router";
import { Redirect } from "@/app/lib/redirect";
import { FormikHelpers } from "formik";

type Props = WithRouterProps & {
};

const LoginPage: NextPage<Props> = ({ router: { query: { redirectTo, message } } }) => {
  const [login] = useLoginMutation();

  const handleSubmit = async (data: LoginFormData, { setSubmitting }: FormikHelpers<LoginFormData>) => {
    const response = await login({
      variables: { data },
    });
    if (response && response.data) {
      setAccessToken(response.data.login.accessToken);
    }
    setSubmitting(false);
    if (!redirectTo || redirectTo.includes("/login")) redirectTo = "/dashboard";
    if (Array.isArray(redirectTo)) redirectTo = redirectTo[0];
    await Redirect(redirectTo);
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
    {message ? <p>{message}</p> : null}
    <LoginForm handleSubmit={handleSubmit} handleValidate={handleValidate}/>
  </>;
};

export default withLayout(withApollo(withRouter(LoginPage)), {
  title: "Login Page"
});
