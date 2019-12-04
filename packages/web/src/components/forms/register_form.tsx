import React from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Button, Label } from "@/app/components/forms/elements";
import { validEmail } from "@/app/pages/register";

export type RegisterFormData = {
  email: string;
  password: string;
};

type Props = {
  handleSubmit: any;
};

export const RegisterForm = ({ handleSubmit }: Props) => {
  const initialFormValues: RegisterFormData = { email: "", password: "" };

  const handleValidate = (values: RegisterFormData) => {
    let errors: any = {};
    if (!values.email) {
      errors.email = "Required";
    } else if (!validEmail.test(values.email)) {
      errors.email = "Invalid email address";
    }
    return errors;
  };

  return (
    <Formik<RegisterFormData> initialValues={initialFormValues} validate={handleValidate} onSubmit={handleSubmit}>
      {({ status, isSubmitting }) => (
        <Form id="register-form">
          {status}
          <Label id="register-form--email">
            <span>Email</span>
            <Field type="email" name="email" placeholder="john.doe@example.com" />
            <ErrorMessage name="email" component="div" />
          </Label>
          <Label id="register-form--password">
            <span>Password</span>
            <Field type="password" name="password" placeholder="**************" />
            <ErrorMessage name="password" component="div" />
          </Label>
          <Label id="register-form--first">
            <span>First Name</span>
            <Field type="text" name="firstName" placeholder="John" />
            <ErrorMessage name="firstName" component="div" />
          </Label>
          <Label id="register-form--last">
            <span>Last Name</span>
            <Field type="text" name="lastName" placeholder="Doe" />
            <ErrorMessage name="lastName" component="div" />
          </Label>
          <Button type="submit" disabled={isSubmitting}>
            Submit
          </Button>
        </Form>
      )}
    </Formik>
  );
};
