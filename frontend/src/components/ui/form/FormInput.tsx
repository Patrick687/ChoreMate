import React from "react";
import { useFormContext } from "react-hook-form";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    name: string;
    label: string;
}

const FormInput: React.FC<FormInputProps> = ({ name, label, ...rest }) => {
    const {
        register,
        formState: { errors },
    } = useFormContext();

    return (
        <div className="mb-4">
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200" htmlFor={name}>
                {label}
            </label>
            <input
                id={name}
                {...register(name)}
                {...rest}
                className="border rounded px-3 py-2 w-full dark:bg-gray-700 dark:text-white"
            />
            {errors[name] && (
                <p className="text-red-500 text-sm mt-1">{(errors[name] as any).message}</p>
            )}
        </div>
    );
};

export default FormInput;