import React, { useState } from "react";
import Modal from "../../ui/Modal";

interface AddChoreModalProps {
    open: boolean;
    onClose: () => void;
    groupId: string;
}

const AddChoreModal: React.FC<AddChoreModalProps> = ({ open, onClose, groupId }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Call mutation to add chore
        onClose();
    };

    return (
        <Modal isOpen={open} onClose={onClose} title="Add Chore">
            <form onSubmit={handleAdd}>
                <label className="block mb-2 font-medium">Title</label>
                <input
                    className="w-full border rounded px-3 py-2 mb-4"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                />
                <label className="block mb-2 font-medium">Description</label>
                <textarea
                    className="w-full border rounded px-3 py-2 mb-4"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />
                <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 transition"
                >
                    Add Chore
                </button>
            </form>
        </Modal>
    );
};

export default AddChoreModal;