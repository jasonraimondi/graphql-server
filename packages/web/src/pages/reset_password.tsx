import { FormikHelpers } from "formik";
import { NextPage } from "next";
import React from "react";

import { withLayout } from "@/app/components/layouts/layout";
import { useUpdatePasswordFromTokenMutation, useValidateForgotPasswordTokenMutation } from "@/generated/graphql";
import { ResetPasswordForm, ResetPasswordFormData } from "@/app/components/forms/reset_password_form";
import { redirectToLogin } from "@/app/lib/auth";

type Props = {
  token: string;
  email: string;
};

const ResetPassword: NextPage<Props> = ({ token, email }) => {
  const [updatePasswordMutation] = useUpdatePasswordFromTokenMutation();
  const [validateForgotPasswordTokenMutation] = useValidateForgotPasswordTokenMutation();

  const handleSubmit = async (data: ResetPasswordFormData, { setSubmitting }: FormikHelpers<ResetPasswordFormData>) => {
    await validateForgotPasswordTokenMutation({
      variables: { email, token },
    });
    await updatePasswordMutation({ variables: { data } });
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

ResetPassword.getInitialProps = async (ctx): Promise<Props> => {
  const {
    query: { e, u },
  } = ctx;
  const token = Array.isArray(u) ? u[0] : u;
  const email = Array.isArray(e) ? e[0] : e;
  if (!token || !email) {
    await redirectToLogin(ctx, true);
  }
  return { token, email };
};

export default withLayout(ResetPassword, {
  title: "Reset Password Page",
});
