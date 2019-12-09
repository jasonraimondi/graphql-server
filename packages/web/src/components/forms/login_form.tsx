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
      {({ isSubmitting, status }) => (
        <Form data-test="login-form">
          <p>{status}</p>
          <Label data-test="login-form--email">
            <span>Email</span>
            <Field type="email" name="email" placeholder="john.doe@example.com" />
            <ErrorMessage data-test="email-error" name="email" component="div" />
          </Label>
          <Label data-test="login-form--password">
            <span>Password</span>
            <Field type="password" name="password" placeholder="******" />
            <br />
            <Link href="/forgot_password">
              <a data-test="forgot-password-link" className="small">
                Forgot Password?
              </a>
            </Link>
            <ErrorMessage data-test="password-error" name="password" component="div" />
          </Label>
          <Button type="submit" disabled={isSubmitting}>
            <span>Submit</span>
          </Button>
        </Form>
      )}
    </Formik>
  );
};
