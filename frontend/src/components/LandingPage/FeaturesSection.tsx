import type React from "react";

const FeaturesSection: React.FC = () => {
    return (
        <section id="features" className="bg-white dark:bg-gray-800 py-12 sm:py-16">
            <div className="max-w-5xl mx-auto px-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-center text-indigo-700 dark:text-indigo-300 mb-8 sm:mb-10">Features</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
                    <div className="bg-indigo-50 dark:bg-gray-900 rounded-lg p-6 flex flex-col items-center shadow">
                        <span className="text-3xl sm:text-4xl mb-4">📝</span>
                        <h3 className="font-semibold text-base sm:text-lg mb-2 text-gray-900 dark:text-gray-100">Assign Chores</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-center text-sm sm:text-base">Easily assign chores to anyone in your group or family.</p>
                    </div>
                    <div className="bg-indigo-50 dark:bg-gray-900 rounded-lg p-6 flex flex-col items-center shadow">
                        <span className="text-3xl sm:text-4xl mb-4">⏰</span>
                        <h3 className="font-semibold text-base sm:text-lg mb-2 text-gray-900 dark:text-gray-100 text-center">Reminders - TBD</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-center text-sm sm:text-base">Get friendly reminders so nothing gets missed.</p>
                    </div>
                    <div className="bg-indigo-50 dark:bg-gray-900 rounded-lg p-6 flex flex-col items-center shadow">
                        <span className="text-3xl sm:text-4xl mb-4">📊</span>
                        <h3 className="font-semibold text-base sm:text-lg mb-2 text-gray-900 dark:text-gray-100">Track Progress</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-center text-sm sm:text-base">See who’s done what and keep everyone accountable.</p>
                    </div>
                    <div className="bg-indigo-50 dark:bg-gray-900 rounded-lg p-6 flex flex-col items-center shadow">
                        <span className="text-3xl sm:text-4xl mb-4">👨‍👩‍👧‍👦</span>
                        <h3 className="font-semibold text-base sm:text-lg mb-2 text-gray-900 dark:text-gray-100">For Everyone</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-center text-sm sm:text-base">Perfect for families, roommates, or any team.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;