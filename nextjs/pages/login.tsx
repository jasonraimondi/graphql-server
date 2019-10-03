import React from "react";
import { Formik } from "formik";
import { MeDocument, MeQuery, useLoginMutation } from "../generated/graphql";
import { withApollo } from "../lib/apollo";
import { setAccessToken } from "../lib/access_token";
import Link from "next/link";
// import Router from "next/router";

const foo = () => {
    const [login] = useLoginMutation();

    const onSubmit = async (data: any, { setSubmitting }: any) => {
        const response = await login({
            variables: { data },
            // @ts-ignore
            update: (store, { data }) => {
                if (!data) {
                    return null;
                }
                store.writeQuery<MeQuery>({
                    query: MeDocument,
                    data: {
                        me: data.login.user
                    }
                });
            }
        });

        console.log(response);

        if (response && response.data) {
            setAccessToken(response.data.login.accessToken);
        }

        // await Router.push("/");
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
    return <div>
        <p>Login Page</p>
        <Link href="/"><a>Home</a></Link>
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
    </div>;
};

export default withApollo(foo);