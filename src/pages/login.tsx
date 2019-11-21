import React from "react";
import { Formik } from "formik";
import Router from "next/router";

import { useLoginMutation } from "@/generated/graphql";
import { withApollo } from "@/app/lib/apollo_next";
import { setAccessToken } from "@/app/lib/access_token";
import { Layout } from "@/app/components/layouts/layout";
import {validEmail} from "@/app/pages/register";

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

  return <Layout title="Hello login page">
    <p>Login Page</p>
    <Formik
      initialValues={{ email: "jason@raimondi.us", password: "" }}
      validate={validate}
      onSubmit={onSubmit}
    >
      {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
        <form onSubmit={handleSubmit}>
          <label style={{ display: "block" }}>
            Email
            <input
              type="email"
              name="email"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
            />
          </label>
          {errors.email && touched.email && errors.email}
          <label style={{ display: "block" }}>
            Password
            <input
              type="password"
              name="password"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
            />
          </label>
          {errors.password && touched.password && errors.password}
          <button type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </form>
      )}
    </Formik>
  </Layout>;
};

export default withApollo(page);