import React from "react";
import { Formik } from "formik";
import { useRegisterMutation } from "../generated/graphql";
// @ts-ignore
import {Layout} from "../components/layout";
import { withApollo } from "../lib/apollo";

const page = () => {
    const [register] = useRegisterMutation();

    const onSubmit = async (data: any, { setSubmitting }: any) => {
        await register({
            variables: { data },
        });
        setSubmitting(false);
    };
    const validate = (values: any) => {
        let errors: any = {};
        if (!values.email) {
            errors.email = "Required";
        } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
        ) {
            errors.email = "Invalid email address";
        }
        return errors;
    };
    return <Layout>
        <p>Register Page</p>
        <Formik
            initialValues={{ email: 'jason@raimondi.us', password: '' }}
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