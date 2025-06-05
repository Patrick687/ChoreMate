import React, { useEffect } from "react";
import { z } from "zod";
import { useUpdateChoreDueDateMutation, useUpdateChoreInfoMutation, type Chore } from "../../graphql/generated";
import FormInput from "../ui/form/FormInput";
import FormSubmitButton from "../ui/form/FormSubmitButton";
import Form from "../ui/form/Form";
import { useDispatch } from "react-redux";
import { updateChoreInfo as updateChoreInfoAction, updateChoreDueDate as updateChoreDueDateAction } from "../../store/groups";
import { Controller, useFormContext } from "react-hook-form";

interface EditChoreDetailProps {
    chore: Chore;
    schema: typeof schema;
    onCancel: () => void;
}

const schema = z.object({
    title: z.string()
        .min(1, "Title is required")
        .max(255, "Title must be less than 255 characters")
        .regex(
            /^[\w\s\-.,!?()@#&$%':";/\\[\]{}|^~`+=*<>]*$/,
            "Title contains invalid characters"
        ),
    description: z.string()
        .max(1000, "Description must be less than 1000 characters")
        .optional()
        .or(z.literal("")),
    hasDueDate: z.boolean(),
    dueDate: z.string().optional().nullable(),
}).superRefine((data, ctx) => {
    if (data.hasDueDate && !data.dueDate) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["dueDate"],
            message: "Due date is required if enabled.",
        });
    }
});

const EditChoreDetail: React.FC<EditChoreDetailProps> = ({ chore, schema, onCancel }) => {
    const dispatch = useDispatch();
    const [updateChoreInfo, { loading, data }] = useUpdateChoreInfoMutation();
    const [updateChoreDueDate, { data: updateChoreDueDateData }] = useUpdateChoreDueDateMutation();

    useEffect(() => {
        if (data?.updateChoreInfo) {
            dispatch(updateChoreInfoAction({
                choreId: chore.id,
                description: data.updateChoreInfo.description,
                title: data.updateChoreInfo.title,
            }));

        }
    }, [data, dispatch, chore.id, onCancel]);

    useEffect(() => {
        if (updateChoreDueDateData?.updateChoreDueDate) {
            dispatch(updateChoreDueDateAction({
                choreId: updateChoreDueDateData.updateChoreDueDate.id,
                dueDate: updateChoreDueDateData.updateChoreDueDate.dueDate,
            }));
            onCancel();
        }
    }, [updateChoreDueDateData, dispatch, chore.id]);

    // Set default values based on the chore
    const defaultValues = {
        title: chore.title,
        description: chore.description || "",
        hasDueDate: !!chore.dueDate, // checked if dueDate exists
        dueDate: chore.dueDate ? chore.dueDate.split("T")[0] : null, // format for <input type="date" />
    };

    const handleSubmit = (values: z.infer<typeof schema>) => {
        // Convert dueDate string (YYYY-MM-DD) to ISO string or null
        let dueDateToSend: Date | null = null;
        if (values.hasDueDate && values.dueDate) {
            // Convert "YYYY-MM-DD" to ISO string (e.g., "2024-06-05T00:00:00.000Z")
            dueDateToSend = new Date(values.dueDate + "T00:00:00");
        }

        updateChoreInfo({
            variables: {
                args: {
                    choreId: chore.id,
                    title: values.title,
                    description: values.description,
                }
            }
        });
        updateChoreDueDate({
            variables: {
                args: {
                    choreId: chore.id,
                    dueDate: dueDateToSend,
                }
            }
        });
    };

    return (
        <Form schema={schema} onSubmit={handleSubmit} defaultValues={defaultValues}>
            <FormInput name="title" label="Title" />
            <FormInput name="description" label="Description" type="textarea" />
            <HasDueDateInput />
            <div className="flex gap-2 mt-4">
                <FormSubmitButton>
                    {loading ? 'Saving...' : 'Save'}
                </FormSubmitButton>
                <button type="button" className="px-4 py-2 bg-gray-300 rounded" onClick={onCancel}>
                    Cancel
                </button>
            </div>
        </Form>
    );
};

export default EditChoreDetail;

const HasDueDateInput = () => {
    const { control, watch, setValue } = useFormContext();
    const hasDueDate = watch("hasDueDate");

    // When disabling due date, clear the value
    React.useEffect(() => {
        if (!hasDueDate) setValue("dueDate", null);
    }, [hasDueDate, setValue]);

    return (
        <div className="mb-4">
            <Controller
                name="hasDueDate"
                control={control}
                render={({ field }) => (
                    <label
                        className="flex items-center gap-2 cursor-pointer select-none text-gray-800 dark:text-gray-200"
                        htmlFor="hasDueDate"
                    >
                        <input
                            id="hasDueDate"
                            type="checkbox"
                            className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                            {...field}
                            checked={field.value}
                        />
                        <span>Has Due Date</span>
                    </label>
                )}
            />
            {hasDueDate && (
                <div className="mt-2">
                    <FormInput
                        name="dueDate"
                        label="Due Date"
                        type="date"
                        className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded px-3 py-2"
                    />
                </div>
            )}
        </div>
    );
};