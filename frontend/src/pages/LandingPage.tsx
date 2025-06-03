import type React from "react";
import HeroSection from "../components/LandingPage.tsx/HeroSection";
import DarkModeToggle from "../components/darkMode/DarkModeToggle";
import Projects from "../components/LandingPage.tsx/Projects";
import ContactSection from "../components/LandingPage.tsx/ContactSection";
const LandingPage: React.FC = () => {
    return (
        <div className="w-full">
            <DarkModeToggle />
            <HeroSection />
            <Projects />
            <ContactSection />
        </div>
    );
};

export default LandingPage;