import React, { useEffect } from "react";
import { z } from "zod";
import Form from "../ui/form/Form";
import FormInput from "../ui/form/FormInput";
import FormSubmitButton from "../ui/form/FormSubmitButton";
import { useSignupMutation } from "../../graphql/generated";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { closeModal } from "../../store/modal";
import type { AppDispatch } from "../../store/store";
import { setAuth } from "../../store/auth";

const nameRegex = /^[a-zA-Z]+$/;
const userNameRegex = /^[a-zA-Z0-9]+$/;
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
        userName: z
            .string()
            .min(7, "Username must be at least 7 characters")
            .max(20, "Username must be at most 20 characters")
            .regex(userNameRegex, "Username must be alphanumeric with no spaces or special characters"),
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
    const [signup, { loading, error, data }] = useSignupMutation();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    useEffect(() => {
        if (data?.signup?.token) {
            dispatch(setAuth({ token: data.signup.token, user: data.signup.user }));
            dispatch(closeModal());
            navigate("/dashboard"); // or whatever your main app route will be
        }
    }, [data, dispatch, navigate]);

    const onSubmit = async (values: z.infer<typeof schema>) => {
        const { confirmPassword, ...input } = values;
        try {
            await signup({ variables: input });
        } catch (e) {
            console.error("Signup error:", e);
        }
    };

    return (
        <Form schema={schema} onSubmit={onSubmit}>
            <FormInput name="firstName" label="First Name" autoComplete="given-name" required />
            <FormInput name="lastName" label="Last Name" autoComplete="family-name" required />
            <FormInput name="userName" label="Username" autoComplete="username" required />
            <FormInput name="email" label="Email" type="email" autoComplete="email" required />
            <FormInput name="password" label="Password" type="password" autoComplete="new-password" required />
            <FormInput name="confirmPassword" label="Confirm Password" type="password" autoComplete="new-password" required />
            <FormSubmitButton>
                {loading ? "Signing up..." : "Sign up"}
            </FormSubmitButton>
            {error && (
                <p className="text-red-500 text-center text-sm mt-2">
                    {error.message}
                </p>
            )}
            {data && (
                <p className="text-green-600 text-sm mt-2">
                    Signup successful!
                </p>
            )}
        </Form>
    );
};

export default SignupForm;