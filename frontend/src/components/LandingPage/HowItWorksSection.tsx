import type React from "react";

const HowItWorksSection: React.FC = () => {
    return (
        <section id="how" className="bg-gray-50 dark:bg-gray-900 py-12 sm:py-16">
            <div className="max-w-4xl mx-auto px-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-center text-indigo-700 dark:text-indigo-300 mb-8 sm:mb-10">How It Works</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
                    <div className="flex flex-col items-center">
                        <div className="bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center text-2xl sm:text-3xl mb-4">1</div>
                        <h3 className="font-semibold text-base sm:text-lg mb-2 text-gray-900 dark:text-gray-100">Create a Group</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-center text-sm sm:text-base">Start by creating a group for your family, roommates, or team.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center text-2xl sm:text-3xl mb-4">2</div>
                        <h3 className="font-semibold text-base sm:text-lg mb-2 text-gray-900 dark:text-gray-100">Add Chores</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-center text-sm sm:text-base">Add chores and assign them to group members with just a few clicks.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center text-2xl sm:text-3xl mb-4">3</div>
                        <h3 className="font-semibold text-base sm:text-lg mb-2 text-gray-900 dark:text-gray-100">Track Completion</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-center text-sm sm:text-base">See progress and keep everyone accountable as chores get done.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;