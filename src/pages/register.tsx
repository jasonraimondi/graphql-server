import React from "react";
import { Formik, FormikHelpers } from "formik";

import { withApollo } from "@/app/lib/apollo_next";
import { useRegisterMutation } from "@/generated/graphql";
import { Layout } from "@/app/components/layouts/layout";

export const validEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

type FormData = {
  email: string;
  password: string;
}

const page = () => {
  const [register, { called, loading }] = useRegisterMutation();
  console.log({called, loading});

  const onSubmit = async (data: any, { setSubmitting, setStatus }: FormikHelpers<FormData>) => {
    await register({
      variables: { data },
    }).catch(e => setStatus(e.message));
    setSubmitting(false);
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
  return <Layout title="This is the register page">
    <p>Register Page</p>
    <Formik
      initialValues={{ email: "jason@raimondi.us", password: "" }}
      validate={validate}
      onSubmit={onSubmit}
    >
      {({
          status,
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => {
        return <form onSubmit={handleSubmit}>
            {status}
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
      }}
    </Formik>
  </Layout>;
};

export default withApollo(page);