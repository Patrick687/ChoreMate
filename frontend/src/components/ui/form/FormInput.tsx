import React from "react";
import { useFormContext } from "react-hook-form";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

interface BaseProps {
    name: string;
    label: string;
    type?: string;
}

type FormInputProps = BaseProps & (InputProps | TextareaProps);

const FormInput: React.FC<FormInputProps> = ({ name, label, type = "text", ...rest }) => {
    const {
        register,
        formState: { errors },
    } = useFormContext();

    return (
        <div className="mb-4">
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200" htmlFor={name}>
                {label}
            </label>
            {type === "textarea" ? (
                <textarea
                    id={name}
                    {...register(name)}
                    {...(rest as TextareaProps)}
                    className="border rounded px-3 py-2 w-full dark:bg-gray-700 dark:text-white"
                />
            ) : (
                <input
                    id={name}
                    type={type}
                    {...register(name)}
                    {...(rest as InputProps)}
                    className="border rounded px-3 py-2 w-full dark:bg-gray-700 dark:text-white"
                />
            )}
            {errors[name] && (
                <p className="text-red-500 text-sm mt-1">{(errors[name] as any).message}</p>
            )}
        </div>
    );
};

export default FormInput;