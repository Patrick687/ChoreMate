import { useDispatch } from "react-redux";
import { openModal } from "../../store/modal";

const HeroSection: React.FC = () => {
    const dispatch = useDispatch();

    return (
        <section className="flex flex-col items-center justify-center flex-1 text-center px-4 py-12 sm:py-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-indigo-700 dark:text-indigo-300 mb-4">
                Make Chores Easy with Chore Mate
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-700 dark:text-gray-200 mb-8">
                Organize, assign, and track chores for your home or group.
            </p>
            <button
                onClick={() => dispatch(openModal("signup"))}
                className="bg-indigo-600 text-white font-semibold px-6 sm:px-8 py-3 rounded-full shadow hover:bg-indigo-700 transition">
                Get Started
            </button>
            {/* Placeholder for illustration/image */}
            <div className="mt-10 sm:mt-12">
                <div className="w-48 h-28 sm:w-64 sm:h-40 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center text-indigo-400 dark:text-indigo-300 text-xl sm:text-2xl">
                    [ Illustration ]
                </div>
            </div>
        </section>
    );
};

export default HeroSection;