import type React from "react";

const DashBoardPage: React.FC = () => {
    return (
        <div className="bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-300">
            <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-200 mt-10">
                Welcome to the Dashboard
            </h1>
            <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
                This is where you can manage your account and settings.
            </p>
        </div>
    );
};
export default DashBoardPage;