import React from "react";
import { z } from "zod";
import Form from "../ui/form/Form";
import FormInput from "../ui/form/FormInput";
import FormSubmitButton from "../ui/form/FormSubmitButton";

const schema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(7, "Password must be at least 7 characters"),
});

const LoginForm: React.FC = () => {
    const onSubmit = (values: z.infer<typeof schema>) => {
        // handle login logic here
        console.log(values);
    };

    return (
        <Form schema={schema} onSubmit={onSubmit}>
            <FormInput name="email" label="Email" type="email" autoComplete="email" required />
            <FormInput name="password" label="Password" type="password" autoComplete="current-password" required />
            <FormSubmitButton>Login</FormSubmitButton>
        </Form>
    );
};

export default LoginForm;