import React from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";

import { Button, Label } from "@/app/components/forms/elements";

export type ForgotPasswordFormData = {
    email: string;
};

type Props = {
    handleValidate: any;
    handleSubmit: any;
};

export const ForgotPasswordForm = ({ handleValidate, handleSubmit }: Props) => {
    return (
        <Formik<ForgotPasswordFormData>
            initialValues={{ email: "" }}
            validate={handleValidate}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting }) => (
                <Form className="login-form">
                    <Label>
                        <span>Email</span>
                        <Field
                            type="email"
                            name="email"
                            placeholder="john.doe@example.com"
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
