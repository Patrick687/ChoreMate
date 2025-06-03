import React from "react";
import { useForm, FormProvider, type DefaultValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodSchema, z } from "zod";

interface FormProps<T extends ZodSchema<any>> {
    schema: T;
    onSubmit: (values: z.infer<T>) => void | Promise<void>;
    children: React.ReactNode;
    defaultValues?: DefaultValues<z.infer<T>>;
}

function Form<T extends ZodSchema<any>>({ schema, onSubmit, children, defaultValues }: FormProps<T>) {
    const methods = useForm<z.infer<T>>({
        resolver: zodResolver(schema),
        defaultValues,
        mode: "onChange",
    });

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
                {children}
            </form>
        </FormProvider>
    );
}

export default Form;