import { FormikHelpers } from "formik";
import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import React from "react";

import { withLayout } from "@/app/components/layouts/layout";
import { ResetPasswordFormData } from "@/app/components/forms/reset_password_form";
import { redirectToLogin } from "@/app/lib/redirect";
import { apiSDK } from "@/app/lib/api_sdk";

type Props = WithRouterProps & {
  token: string;
  email: string;
};

const ResetPasswordForm = dynamic(() => import("@/app/components/forms/reset_password_form"), { ssr: false });

const ResetPassword: NextPage<Props> = ({
  router: {
    query: { e, u },
  },
}) => {
  const email = Array.isArray(e) ? e[0] : e;
  const token = Array.isArray(u) ? u[0] : u;

  const handleSubmit = async (data: ResetPasswordFormData, { setSubmitting }: FormikHelpers<ResetPasswordFormData>) => {
    await apiSDK.ValidateForgotPasswordToken({ email, token });
    await apiSDK.UpdatePasswordFromToken({ data });
    setSubmitting(false);
    await redirectToLogin();
  };

  return (
    <>
      <h1 className="h5">Reset Password Page</h1>
      <ResetPasswordForm token={token} email={email} handleSubmit={handleSubmit} />
    </>
  );
};

export default withLayout(withRouter(ResetPassword), {
  title: "Reset Password Page",
});
