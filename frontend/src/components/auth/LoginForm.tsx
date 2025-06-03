import React, { useEffect } from "react";
import { z } from "zod";
import Form from "../ui/form/Form";
import FormInput from "../ui/form/FormInput";
import FormSubmitButton from "../ui/form/FormSubmitButton";
import { useLoginMutation } from "../../graphql/generated";
import { useDispatch } from "react-redux";
import { setToken } from "../../store/auth";
import { useNavigate } from "react-router-dom";
import { closeModal } from "../../store/modal";
import type { AppDispatch } from "../../store/store";

const schema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(7, "Password must be at least 7 characters"),
});

const LoginForm: React.FC = () => {
    const [login, { loading, error, data }] = useLoginMutation();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    useEffect(() => {
        if (data?.login?.token) {
            dispatch(setToken(data.login.token));
            dispatch(closeModal());
            navigate("/dashboard"); // or your main app route
        }
    }, [data, dispatch, navigate]);

    const onSubmit = async (values: z.infer<typeof schema>) => {
        try {
            await login({ variables: values });
        } catch (e) {
            console.error("Login error:", e);
        }
    };

    return (
        <Form schema={schema} onSubmit={onSubmit}>
            <FormInput name="email" label="Email" type="email" autoComplete="email" required />
            <FormInput name="password" label="Password" type="password" autoComplete="current-password" required />
            <FormSubmitButton>
                {loading ? "Logging in..." : "Login"}
            </FormSubmitButton>
            {error && (
                <p className="text-red-500 text-center text-sm mt-2">
                    {error.message}
                </p>
            )}
            {data && (
                <p className="text-green-600 text-sm mt-2">
                    Login successful!
                </p>
            )}
        </Form>
    );
};

export default LoginForm;