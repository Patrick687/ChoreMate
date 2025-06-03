import { useFormContext } from "react-hook-form";

const FormSubmitButton: React.FC<{ children?: React.ReactNode; }> = ({ children = "Submit", }) => {
    const { formState } = useFormContext();
    return (
        <button
            className="bg-indigo-600 text-white px-4 py-2 rounded w-full disabled:opacity-50"
            type="submit"
            disabled={!formState.isValid || formState.isSubmitting}
        >
            {children}
        </button>
    );
};

export default FormSubmitButton;