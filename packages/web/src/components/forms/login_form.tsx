import React from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Button, Label } from "@/app/components/forms/elements";
import { Link } from "@/app/components/hoc/nav_link";
import { validEmail } from "@/app/pages/register";

export type LoginFormData = {
  email: string;
  password: string;
};

type Props = {
  handleSubmit: any;
};

export const LoginForm = ({ handleSubmit }: Props) => {
  const handleValidate = (values: LoginFormData) => {
    let errors: any = {};
    if (!values.email) {
      errors.email = "Required";
    } else if (!validEmail.test(values.email)) {
      errors.email = "Invalid email address";
    }
    return errors;
  };

  return (
    <Formik<LoginFormData>
      initialValues={{ email: "", password: "" }}
      validate={handleValidate}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form id="login-form">
          <Label id="login-form--email">
            <span>Email</span>
            <Field type="email" name="email" placeholder="john.doe@example.com" />
            <ErrorMessage name="email" component="div" />
          </Label>
          <Label id="login-form--password">
            <span>Password</span>
            <Field type="password" name="password" placeholder="******" />
            <br />
            <Link href="/forgot_password">
              <a id="forgot-password-link" className="small">
                Forgot Password?
              </a>
            </Link>
            <ErrorMessage name="password" component="div" />
          </Label>
          <Button type="submit" disabled={isSubmitting}>
            <span>Submit</span>
          </Button>
        </Form>
      )}
    </Formik>
  );
};
