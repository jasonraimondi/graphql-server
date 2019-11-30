import React from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Button, Label } from "@/app/components/forms/elements";

export type RegisterFormData = {
    email: string;
    password: string;
};

type Props = {
    handleValidate: any;
    handleSubmit: any;
};

export const RegisterForm = ({ handleValidate, handleSubmit }: Props) => {
    const initialFormValues: RegisterFormData = { email: "", password: "" };

    return (
        <Formik<RegisterFormData>
            initialValues={initialFormValues}
            validate={handleValidate}
            onSubmit={handleSubmit}
        >
            {({ status, isSubmitting }) => (
                <Form>
                    {status}
                    <Label>
                        <span>Email</span>
                        <Field
                            type="email"
                            name="email"
                            placeholder="john.doe@example.com"
                        />
                        <ErrorMessage name="email" component="div" />
                    </Label>
                    <Label>
                        <span>Password</span>
                        <Field
                            type="password"
                            name="password"
                            placeholder="**************"
                        />
                        <ErrorMessage name="password" component="div" />
                    </Label>
                    <Label>
                        <span>First Name</span>
                        <Field
                            type="text"
                            name="firstName"
                            placeholder="John"
                        />
                        <ErrorMessage name="firstName" component="div" />
                    </Label>
                    <Label>
                        <span>Last Name</span>
                        <Field type="text" name="lastName" placeholder="Doe" />
                        <ErrorMessage name="lastName" component="div" />
                    </Label>
                    <Button type="submit" disabled={isSubmitting}>
                        Submit
                    </Button>
                </Form>
            )}
        </Formik>
    );
};
