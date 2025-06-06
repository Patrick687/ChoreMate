import React, { useState, useRef, useEffect } from "react";
import { z } from "zod";

type FieldType = "text" | "textarea" | "select" | "date";

interface InlineEditFieldProps {
    value: string;
    type?: FieldType;
    options?: { value: string; label: string; }[]; // for select
    placeholder?: string;
    onSave: (value: string) => Promise<void> | void;
    className?: string;
    display?: React.ReactNode;
    disabled?: boolean;
    schema?: z.ZodType<any, any>;
}

const InlineEditField: React.FC<InlineEditFieldProps> = ({
    value,
    type = "text",
    options,
    placeholder,
    onSave,
    className = "",
    display,
    disabled = false,
    schema
}) => {
    const [editing, setEditing] = useState(false);
    const [inputValue, setInputValue] = useState(value || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(null);

    useEffect(() => {
        if (editing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editing]);

    useEffect(() => {
        setInputValue(value || "");
    }, [value]);

    const handleSave = async () => {
        if (schema) {
            const result = schema.safeParse(inputValue);
            if (!result.success) {
                setError(result.error.errors[0].message);
                return;
            }
        }
        setError(null);
        if (inputValue !== value) {
            setLoading(true);
            await onSave(inputValue);
            setLoading(false);
        }
        setEditing(false);
    };

    const handleBlur = () => {
        handleSave();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && type !== "textarea") {
            handleSave();
        }
        if (e.key === "Escape") {
            setEditing(false);
            setInputValue(value || "");
        }
    };

    if (editing && !disabled) {
        if (type === "textarea") {
            return (
                <>
                    <textarea
                        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                        className={`border rounded px-2 py-1 w-full ${className}`}
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        disabled={loading}
                    />
                    {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
                </>
            );
        }
        if (type === "select" && options) {
            return (
                <>
                    <select
                        ref={inputRef as React.RefObject<HTMLSelectElement>}
                        className={`border rounded px-2 py-1 ${className}`}
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        onBlur={handleBlur}
                        disabled={loading}
                    >
                        {options.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                    {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
                </>
            );
        }
        return (
            <>
                <input
                    ref={inputRef as React.RefObject<HTMLInputElement>}
                    type={type}
                    className={`border rounded px-2 py-1 ${className}`}
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    disabled={loading}
                />
                {error && <div className="text-red-500 text-xs mb-1">{error}</div>}
            </>
        );
    }

    return (
        <span
            className={`inline-block min-w-[80px] cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-1 rounded transition ${className} ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
            onClick={() => !disabled && setEditing(true)}
            tabIndex={0}
            style={{ outline: "none" }}
        >
            {display ?? (value || <span className="text-gray-400">{placeholder || "Click to add"}</span>)}
        </span>
    );
};

export default InlineEditField;