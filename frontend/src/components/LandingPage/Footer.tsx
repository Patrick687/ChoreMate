import type React from "react";

const Footer: React.FC = () => {
    return (
        <footer className="bg-white dark:bg-gray-800 py-6 mt-auto" >
            <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-gray-500 dark:text-gray-400 text-sm">
                <div>© {new Date().getFullYear()} Chore Mate</div>
            </div>
        </footer >
    );
};

export default Footer;