import { useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

function DarkModeToggle() {
    const [showButton, setShowButton] = useState(false);
    const [isDark, setIsDark] = useState(
        typeof window !== "undefined" && document.documentElement.classList.contains("dark")
    );

    const toggleDark = () => {
        document.documentElement.classList.toggle("dark");
        setIsDark((prev) => !prev);
    };

    return (

        <div
            onClick={toggleDark}
            className="fixed right-4 top-4 w-10 md:w-15 h-10 md:h-15 flex items-center justify-center rounded-full bg-white/80 hover:bg-gray-100 dark:bg-gray-800/80 dark:hover:bg-gray-700/80 shadow cursor-pointer transition"
        >
            {isDark ? (
                <FaMoon className="text-gray-700 dark:text-yellow-300 text-xl md:text-2xl" />
            ) : (
                <FaSun className="text-yellow-400 dark:text-gray-300 text-xl md:text-2xl" />
            )}
        </div>
    );
}

export default DarkModeToggle;