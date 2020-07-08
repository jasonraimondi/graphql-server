import { FormikHelpers } from "formik";
import { NextPage } from "next";
import { withRouter } from "next/router";
import React from "react";

import { withLayout } from "@/app/components/layouts/layout";
import { WithRouterProps } from "next/dist/client/with-router";
import { ForgotPasswordFormData } from "@/app/components/forms/forgot_password_form";
import { Redirect } from "@/app/lib/redirect";
import dynamic from "next/dynamic";
import { apiSDK } from "@/app/lib/api_sdk";

type Props = WithRouterProps & {};

const ForgotPasswordForm = dynamic(() => import("@/app/components/forms/forgot_password_form"), { ssr: false });

const ForgotPassword: NextPage<Props> = () => {
  const handleSubmit = async (
    data: ForgotPasswordFormData,
    { setSubmitting }: FormikHelpers<ForgotPasswordFormData>
  ) => {
    await apiSDK.SendForgotPasswordEmail({ email: data.email });
    await Redirect("/");
    setSubmitting(false);
  };

  return (
    <>
      <h1 className="h5">Forgot Password Page</h1>
      <ForgotPasswordForm handleSubmit={handleSubmit} />
    </>
  );
};

export default withLayout(withRouter(ForgotPassword), {
  title: "Login Page",
});
