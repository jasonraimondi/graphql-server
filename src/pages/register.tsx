import React from "react";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";

import { withApollo } from "@/app/lib/apollo_next";
import { useRegisterMutation } from "@/generated/graphql";
import { Layout } from "@/app/components/layouts/layout";

export const validEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

type RegisterFormData = {
  email: string;
  password: string;
}

const page = () => {
  const [register, { called, loading }] = useRegisterMutation();
  console.log({called, loading});

  const initialFormValues: RegisterFormData = { email: "", password: "" };

  const handleSubmit = async (data: any, { setSubmitting, setStatus }: FormikHelpers<RegisterFormData>) => {
    await register({ variables: { data } }).catch(e => setStatus(e.message.replace(/GraphQL error: /gi, "")));
    setSubmitting(false);
  };

  const handleValidate = (values: any) => {
    let errors: any = {};
    if (!values.email) {
      errors.email = "Required";
    } else if (!validEmail.test(values.email)) {
      errors.email = "Invalid email address";
    }
    return errors;
  };

  return <Layout title="Register page">
    <h1>Register Page</h1>
    <Formik<RegisterFormData>
      initialValues={initialFormValues}
      validate={handleValidate}
      onSubmit={handleSubmit}
    >
      {({ status, isSubmitting }) => (
        <Form className="register-form">
          {status}
          <label>
            Email
            <Field type="email" name="email" placeholder="john.doe@example.com"/>
            <ErrorMessage name="email" component="div"/>
          </label>
          <label>
            First Name
            <Field type="password" name="password" placeholder="**************"/>
            <ErrorMessage name="password" component="div"/>
          </label>
          <label>
            First Name
            <Field type="first" name="first" placeholder="John"/>
            <ErrorMessage name="first" component="div"/>
          </label>
          <label>
            Password
            <Field type="last" name="last" placeholder="Doe"/>
            <ErrorMessage name="last" component="div"/>
          </label>
          <button type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </Form>
      )}
    </Formik>

    <style jsx>{`
      .register-form {
        color: teal;
      }
      .register-form label {
        display: block;
      }
    `}</style>
  </Layout>;
};

export default withApollo(page);