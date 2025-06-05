import React from "react";
import Header from "../components/LandingPage/Header";
import Footer from "../components/LandingPage/Footer";
import { Outlet } from "react-router-dom";

const RootLayout: React.FC = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-300">
        <Header />
        <main className="flex-1 mx-2">
            <Outlet />
        </main>
        <Footer />
    </div>
);

export default RootLayout;