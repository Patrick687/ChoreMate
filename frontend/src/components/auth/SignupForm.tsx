import React from "react";
import { z } from "zod";
import Form from "../ui/form/Form";
import FormInput from "../ui/form/FormInput";
import FormSubmitButton from "../ui/form/FormSubmitButton";

const nameRegex = /^[a-zA-Z]+$/;
const usernameRegex = /^[a-zA-Z0-9]+$/;
const passwordSpecialCharRegex = /[^A-Za-z0-9]/;

const schema = z
    .object({
        firstName: z
            .string()
            .min(2, "First name must be at least 2 characters")
            .max(50, "First name must be less than 50 characters")
            .regex(nameRegex, "First name must be alphabetic with no spaces"),
        lastName: z
            .string()
            .min(2, "Last name must be at least 2 characters")
            .max(50, "Last name must be less than 50 characters")
            .regex(nameRegex, "Last name must be alphabetic with no spaces"),
        username: z
            .string()
            .min(7, "Username must be at least 7 characters")
            .max(20, "Username must be at most 20 characters")
            .regex(usernameRegex, "Username must be alphanumeric with no spaces or special characters"),
        email: z.string().email("Please enter a valid email address"),
        password: z
            .string()
            .min(7, "Password must be at least 7 characters")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[0-9]/, "Password must contain at least one number")
            .regex(passwordSpecialCharRegex, "Password must contain at least one special character"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

const SignupForm: React.FC = () => {
    const onSubmit = (values: z.infer<typeof schema>) => {
        // handle signup logic here
        console.log(values);
    };

    return (
        <Form schema={schema} onSubmit={onSubmit}>
            <FormInput name="firstName" label="First Name" autoComplete="given-name" required />
            <FormInput name="lastName" label="Last Name" autoComplete="family-name" required />
            <FormInput name="username" label="Username" autoComplete="username" required />
            <FormInput name="email" label="Email" type="email" autoComplete="email" required />
            <FormInput name="password" label="Password" type="password" autoComplete="new-password" required />
            <FormInput name="confirmPassword" label="Confirm Password" type="password" autoComplete="new-password" required />
            <FormSubmitButton>Sign up</FormSubmitButton>
        </Form>
    );
};

export default SignupForm;