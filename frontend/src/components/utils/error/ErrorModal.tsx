import type React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../../store/auth";
import { useNavigate } from "react-router-dom";
import { closeModal } from "../../../store/modal";

interface ErrorModalProps {
    message?: string;
}

const defaultMessage =
    "Uh oh! Looks like a bug forgot to do its chores and is causing trouble. Please log in again to help us tidy things up!";



const ErrorModal: React.FC<ErrorModalProps> = ({ message = defaultMessage }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    function handleLoginAgain() {
        dispatch(logout());
        dispatch(closeModal());
        navigate("/login");
    }

    return (
        <div className="text-center">
            <p className="mb-6 text-red-600">{message}</p>
            <button
                className="px-4 py-2 bg-indigo-600 text-white rounded"
                onClick={handleLoginAgain}
            >
                Log Out
            </button>
        </div>
    );
};

export default ErrorModal;