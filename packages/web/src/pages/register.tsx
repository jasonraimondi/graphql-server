import { FormikHelpers } from "formik";
import { NextPage } from "next";
import React from "react";

import { withApollo } from "@/app/lib/apollo_next";
import { useRegisterMutation } from "@/generated/graphql";
import { withLayout } from "@/app/components/layouts/layout";
import { RegisterForm } from "@/app/components/forms/register_form";

export const validEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

type RegisterFormData = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
};

const Register: NextPage<{}> = () => {
  const [register] = useRegisterMutation();

  const handleSubmit = async (
    registerFormData: RegisterFormData,
    { setSubmitting, setStatus }: FormikHelpers<RegisterFormData>
  ) => {
    try {
      const res = await register({ variables: { data: registerFormData } });
      console.log("register response page", res);
    } catch (e) {
      setStatus(e.message.replace(/GraphQL error: /gi, ""));
    }
    setSubmitting(false);
  };

  return (
    <>
      <h1>Register Page</h1>
      <RegisterForm handleSubmit={handleSubmit} />
    </>
  );
};

export default withLayout(withApollo(Register), {
  title: "Register Page",
});
