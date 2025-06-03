import type React from "react";
import HeroSection from "../components/LandingPage/HeroSection";
import FeaturesSection from "../components/LandingPage/FeaturesSection";
import HowItWorksSection from "../components/LandingPage/HowItWorksSection";
import CallToActionSection from "../components/LandingPage/CallToAction";

const LandingPage: React.FC = () => {
    return (
        <>
            <div className="bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-300">
                <HeroSection />
                <FeaturesSection />
                <HowItWorksSection />
                <CallToActionSection />
            </div>
        </>

    );
};
export default LandingPage;