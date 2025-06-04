import React, { useRef } from "react";
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

    const inputRef = useRef<HTMLInputElement>(null);
    const { ref: registerRef, ...registerRest } = register(name);

    // Merge refs for the date input
    const handleRef = (el: HTMLInputElement) => {
        inputRef.current = el;
        if (typeof registerRef === "function") {
            registerRef(el);
        } else if (registerRef) {
            (registerRef as React.MutableRefObject<HTMLInputElement | null>).current = el;
        }
    };

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
            ) : type === "date" ? (
                <div className="relative">
                    <input
                        id={name}
                        type="date"
                        ref={handleRef}
                        {...registerRest}
                        {...(rest as InputProps)}
                        className="border rounded px-3 py-2 w-full dark:bg-gray-700 dark:text-white"
                    />

                </div>
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