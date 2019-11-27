import React from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Button, Label } from "@/app/components/forms/elements";

export type LoginFormData = {
  email: string;
  password: string;
}

type Props = {
  handleValidate: any;
  handleSubmit: any;
};

export const LoginForm = ({ handleValidate, handleSubmit }: Props) => {
  return <Formik<LoginFormData>
    initialValues={{ email: "", password: "" }}
    validate={handleValidate}
    onSubmit={handleSubmit}
  >
    {({ isSubmitting }) => (
      <Form className="login-form">
        <Label>
          <span>Email</span>
          <Field type="email" name="email" placeholder="john.doe@example.com"/>
          <ErrorMessage name="email" component="div"/>
        </Label>
        <Label>
          <span>Password</span>
          <Field type="password" name="password" placeholder="******"/>
          <ErrorMessage name="password" component="div"/>
        </Label>
        <Button type="submit" disabled={isSubmitting}>
          <span>Submit</span>
        </Button>
      </Form>
    )}
  </Formik>;
};