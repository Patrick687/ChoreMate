import React, { useState } from "react";
import { FaEnvelope, FaLinkedin, FaGithub, FaRegCopy, FaCheck } from "react-icons/fa";

const EMAIL = "pklein111697@gmail.com";
const LINKEDIN = "https://www.linkedin.com/in/patrick-hal-klein/";
const GITHUB = "https://github.com/Patrick687";
const RESUME = "/resume.pdf";

const ContactSection: React.FC = () => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(EMAIL);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <section className="w-full flex flex-col items-center py-12 bg-gray-50 dark:bg-gray-900 transition-colors">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                Contact Me
            </h2>
            <div className="flex flex-col items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                    <FaEnvelope className="text-blue-600 dark:text-blue-400 text-xl" />
                    <span className="text-gray-700 dark:text-gray-200 font-mono">{EMAIL}</span>
                    <button
                        onClick={handleCopy}
                        className="ml-2 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                        aria-label="Copy email"
                    >
                        {copied ? (
                            <FaCheck className="text-green-500" />
                        ) : (
                            <FaRegCopy className="text-gray-500" />
                        )}
                    </button>
                    <a
                        href={`mailto:${EMAIL}`}
                        className="ml-2 px-3 py-1 rounded bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition"
                    >
                        Email Me
                    </a>
                </div>
                <div className="flex gap-4 mt-2">
                    <a
                        href={LINKEDIN}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold hover:bg-blue-200 dark:hover:bg-blue-800 transition"
                    >
                        <FaLinkedin className="text-xl" /> LinkedIn
                    </a>
                    <a
                        href={GITHUB}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    >
                        <FaGithub className="text-xl" /> GitHub
                    </a>
                    <a
                        href={RESUME}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition"
                    >
                        <span>Resume</span>
                    </a>
                </div>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
                I’m always open to new opportunities, collaborations, or just a chat!
            </p>
        </section>
    );
};

export default ContactSection;