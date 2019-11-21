import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Router from "next/router";

import { useLoginMutation } from "@/generated/graphql";
import { withApollo } from "@/app/lib/apollo_next";
import { setAccessToken } from "@/app/lib/access_token";
import { Layout } from "@/app/components/layouts/layout";
import {validEmail} from "@/app/pages/register";

type LoginFormData = {
  email: string;
  password: string;
}

const page = () => {
  const [login] = useLoginMutation();

  const onSubmit = async (data: any, { setSubmitting }: any) => {
    console.log("form submitted");
    const response = await login({
      variables: { data },
      update: (store: any, { data }): any => {
        if (!data) {
          return null;
        }
        console.log(store, data);

        // store.writeQuery<MeQuery>({
        //     query: MeDocument,
        //     data: {
        //         me: data.login.user
        //     }
        // });
      },
    });

    console.log(response);

    if (response && response.data) {
      setAccessToken(response.data.login.accessToken);
    }

    setSubmitting(false);
    await Router.push("/");
  };
  const validate = (values: any) => {
    let errors: any = {};
    if (!values.email) {
      errors.email = "Required";
    } else if (!validEmail.test(values.email)) {
      errors.email = "Invalid email address";
    }
    return errors;
  };

  return <Layout title="Login page">
    <h1>Login Page</h1>
    <Formik<LoginFormData>
      initialValues={{ email: '', password: '' }}
      validate={validate}
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="login-form">
          <label>
            Email
            <Field type="email" name="email" placeholder="john.doe@example.com"/>
            <ErrorMessage name="email" component="div"/>
          </label>
          <label>
            Password
            <Field type="password" name="password" placeholder="******"/>
            <ErrorMessage name="password" component="div"/>
          </label>
          <button type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </Form>
      )}
    </Formik>
    <style jsx>{`
      .login-form label {
        background-color: blue;
        display: block;
      }
    `}</style>
  </Layout>;
};

export default withApollo(page);