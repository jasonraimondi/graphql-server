import { FormikHelpers } from "formik";
import { NextPage } from "next";
import React from "react";

import { withApollo } from "@/app/lib/apollo_next";
import { useRegisterMutation } from "@/generated/graphql";
import { withLayout } from "@/app/components/layouts/layout";
import { RegisterForm } from "@/app/components/forms/register_form";

export const validEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

type RegisterFormData = {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
};

const Register: NextPage<{}> = () => {
    const [register, { called, loading }] = useRegisterMutation();
    console.log({ called, loading });

    const handleSubmit = async (
        data: RegisterFormData,
        { setSubmitting, setStatus }: FormikHelpers<RegisterFormData>
    ) => {
        await register({ variables: { data } }).catch(e =>
            setStatus(e.message.replace(/GraphQL error: /gi, ""))
        );
        setSubmitting(false);
    };

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
        <>
            <h1>Register Page</h1>
            <RegisterForm
                handleSubmit={handleSubmit}
                handleValidate={handleValidate}
            />
        </>
    );
};

export default withLayout(withApollo(Register), {
    title: "Register Page",
});
