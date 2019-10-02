import React, { useState } from "react";
import { Formik } from "formik";
import { useRegisterMutation } from "../generated/graphql";
import withApollo from "../lib/apollo";

const foo = () => {
    const [register] = useRegisterMutation();
    const handleRegister = async (e) => {
        e.preventDefault();
        const result = await register({
            variables: {
                data: {
                    email,
                    password,
                    firstName: "hi ya",
                    lastName: "slugger",
                },
            },
        });
        console.log(result);
    };

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return <div>
        <Formik
            initialValues={{ email: '', password: '' }}
            validate={values => {
                let errors: any = {};
                if (!values.email) {
                    errors.email = 'Required';
                } else if (
                    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                ) {
                    errors.email = 'Invalid email address';
                }
                return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
                setTimeout(() => {
                    alert(JSON.stringify(values, null, 2));
                    setSubmitting(false);
                }, 400);
            }}
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
                    <input
                        type="email"
                        name="email"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email}
                    />
                    {errors.email && touched.email && errors.email}
                    <input
                        type="password"
                        name="password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.password}
                    />
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