import type React from "react";
import Header from "../components/LandingPage/Header";
import HeroSection from "../components/LandingPage/HeroSection";
import FeaturesSection from "../components/LandingPage/FeaturesSection";
import HowItWorksSection from "../components/LandingPage/HowItWorksSection";
import CallToActionSection from "../components/LandingPage/CallToAction";
import Footer from "../components/LandingPage/Footer";

const LandingPage: React.FC = () => {
    return (
        <>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-300">
                <Header />
                <HeroSection />
                <FeaturesSection />
                <HowItWorksSection />
                <CallToActionSection />
                <Footer />
            </div>
        </>

    );
};
export default LandingPage;