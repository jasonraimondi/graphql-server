import { FormikHelpers } from "formik";
import { NextPage } from "next";
import { withRouter } from "next/router";
import React from "react";

import { withApollo } from "@/app/lib/apollo_next";
import { withLayout } from "@/app/components/layouts/layout";
import { WithRouterProps } from "next/dist/client/with-router";
import { ForgotPasswordForm, ForgotPasswordFormData } from "@/app/components/forms/forgot_password_form";
import { validEmail } from "@/app/pages/register";
import { useSendForgotPasswordEmailMutation } from "@/generated/graphql";

type Props = WithRouterProps & {};

const ForgotPassword: NextPage<Props> = () => {

  const [forgotPassword] = useSendForgotPasswordEmailMutation();

  const handleSubmit = async (data: ForgotPasswordFormData, { setSubmitting }: FormikHelpers<ForgotPasswordFormData>) => {
    await forgotPassword({ variables: { email: data.email } });
    setSubmitting(false);
  };

  const handleValidate = (values: ForgotPasswordFormData) => {
    let errors: any = {};
    if (!values.email) {
      errors.email = "Required";
    } else if (!validEmail.test(values.email)) {
      errors.email = "Invalid email address";
    }
    return errors;
  };

  return <>
    <h1 className="h5">Forgot Password Page</h1>
    <ForgotPasswordForm handleValidate={handleValidate} handleSubmit={handleSubmit}/>
  </>;
};

export default withLayout(withApollo(withRouter(ForgotPassword)), {
  title: "Login Page",
});
