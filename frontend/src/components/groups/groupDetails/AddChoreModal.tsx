import React, { useEffect } from "react";
import Form from "../../ui/form/Form";
import FormInput from "../../ui/form/FormInput";
import FormSubmitButton from "../../ui/form/FormSubmitButton";
import { useCreateChoreMutation, type CreateChoreInput } from "../../../graphql/generated";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../../store/modal";
import { addChore } from "../../../store/groups";
import type { RootState } from "../../../store/store";

interface AddChoreModalProps {
    groupId: string;
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
        .or(z.literal("")) // allow empty string as optional
});

const AddChoreModal: React.FC<AddChoreModalProps> = ({ groupId }) => {
    const [createChore, { loading, error, data }] = useCreateChoreMutation();
    const dispatch = useDispatch();

    const group = useSelector((state: RootState) => state.groups.groups.find(g => g.id === groupId));

    useEffect(() => {
        if (data?.createChore.id) {

            if (!group) {
                console.error(`Group with id ${groupId} not found in state when creating chore.`);
            }
            else {
                dispatch(addChore({
                    groupId,
                    chore: {
                        ...data.createChore,
                        group
                    }
                }));
            }
            dispatch(closeModal());
            console.log('Chore created successfully:', data.createChore);
        }
    }, [data, dispatch]);


    async function onSubmit(values: z.infer<typeof schema>) {
        const createChoreInput: CreateChoreInput = {
            title: values.title,
            description: values.description,
            groupId: groupId,
            isRecurring: false, //TODO: Add recurring option
        };

        try {
            await createChore({ variables: { args: createChoreInput } });
        } catch (err) {
            console.error("Error creating chore:", err);
        }
    }


    return (
        <Form schema={schema} onSubmit={onSubmit}>
            <FormInput name="title" label="Title" autoComplete="off" required />
            <FormInput name="description" label="Description" autoComplete="off" required />
            <FormSubmitButton>
                {loading ? "Creating Chore" : "Create Chore"}
            </FormSubmitButton>
            {error && (
                <p className="text-red-500 text-center text-sm mt-2">
                    {error.message}
                </p>
            )}
        </Form>
    );
};

// <Modal isOpen={open} onClose={onClose} title="Add Chore">
//     <form onSubmit={handleAdd}>
//         <label className="block mb-2 font-medium">Title</label>
//         <input
//             className="w-full border rounded px-3 py-2 mb-4"
//             value={title}
//             onChange={e => setTitle(e.target.value)}
//             required
//         />
//         <label className="block mb-2 font-medium">Description</label>
//         <textarea
//             className="w-full border rounded px-3 py-2 mb-4"
//             value={description}
//             onChange={e => setDescription(e.target.value)}
//         />
//         <button
//             type="submit"
//             className="w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 transition"
//         >
//             Add Chore
//         </button>
//     </form>
// </Modal>

export default AddChoreModal;