import React from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";

import { Button, Label } from "@/app/components/forms/elements";
import { validEmail } from "@/app/pages/register";

export type ResetPasswordFormData = {
    token: string;
    email: string;
    password: string;
};

type Props = {
    handleSubmit: any;
    token: string;
    email: string;
};

export const ResetPasswordForm = ({ handleSubmit, token, email }: Props) => {
    const handleValidate = (values: ResetPasswordFormData) => {
        let errors: any = {};
        if (!values.email) {
            errors.email = "Required";
        } else if (!validEmail.test(values.email)) {
            errors.email = "Invalid email address";
        }
        return errors;
    };

    return (
        <Formik<ResetPasswordFormData>
            initialValues={{ email, token, password: "" }}
            validate={handleValidate}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting }) => (
                <Form>
                    <Label>
                        <span>Password</span>
                        <Field
                            type="password"
                            name="password"
                            placeholder="************"
                        />
                        <ErrorMessage name="email" component="div" />
                    </Label>
                    <Button type="submit" disabled={isSubmitting}>
                        <span>Submit</span>
                    </Button>
                </Form>
            )}
        </Formik>
    );
};
