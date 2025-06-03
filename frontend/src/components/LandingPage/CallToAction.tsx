import type React from "react";
import { useDispatch } from "react-redux";
import { openModal } from "../../store/modal";

const CallToActionSection: React.FC = () => {
    const dispatch = useDispatch();
    return (
        <section className="bg-indigo-600 py-12 sm:py-16" >
            <div className="max-w-2xl mx-auto text-center px-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Ready to make chores easy?</h2>
                <p className="text-indigo-100 mb-8 text-sm sm:text-base">Sign up now and start organizing your group’s chores in minutes.</p>
                <a
                    onClick={() => dispatch(openModal("signup"))}
                    className="inline-block bg-white text-indigo-600 font-semibold px-6 sm:px-8 py-3 rounded-full shadow hover:bg-indigo-50 transition"
                >
                    Get Started
                </a>
            </div>
        </section >
    );
};

export default CallToActionSection;