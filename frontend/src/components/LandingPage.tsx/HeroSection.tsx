import { useEffect, useState } from "react";

const HeroSection: React.FC = () => {
    return (
        <div className="py-14 flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors">
            <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 md:p-12 flex flex-col items-center max-w-xl w-full transition-colors">
                {/* Optional Avatar */}
                <img
                    src="/patrickKlein.jpg"
                    alt="Patrick Klein"
                    className="w-32 h-32 rounded-2xl mb-6 shadow-md object-cover"
                />
                {/* Name & Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                    Hi, I’m <span className="text-blue-600 dark:text-blue-400">Patrick Klein</span>,<br />
                    a Full Stack Software Engineer
                </h1>
                {/* Value Prop */}
                <AnimatedValueProp />
                {/* CTA Buttons */}
                <div className="flex gap-4">
                    <a
                        href="/resume.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition"
                    >
                        View Resume
                    </a>
                    <a
                        href="mailto:pklein111697@gmail.com"
                        className="px-6 py-2 rounded-lg border border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 dark:border-blue-400 dark:text-blue-300 dark:hover:bg-gray-700 transition"
                    >
                        Contact Me
                    </a>
                </div>
            </section>
        </div>
    );
};

export default HeroSection;




const valueProps = [
    "I enjoy building small, practical web apps while continuously learning new technologies.",
    "I’m passionate about creating clean, user-friendly web projects as I grow my skills.",
    "I focus on building simple, effective web apps and expanding my full stack knowledge.",
    "I’m a motivated learner who enjoys turning ideas into working web applications.",
    "I’m developing my skills by building real-world projects with a focus on usability.",
];

const ANIMATION_DURATION = 600; // ms for fade in/out
const DISPLAY_DURATION = 4000; // ms to show each message

const AnimatedValueProp: React.FC = () => {
    const [index, setIndex] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        const fadeOutTimeout = setTimeout(() => setFade(false), DISPLAY_DURATION);
        const nextTimeout = setTimeout(() => {
            setIndex((i) => (i + 1) % valueProps.length);
            setFade(true);
        }, DISPLAY_DURATION + ANIMATION_DURATION);

        return () => {
            clearTimeout(fadeOutTimeout);
            clearTimeout(nextTimeout);
        };
    }, [index]);

    return (
        <p
            className={`text-lg text-gray-600 dark:text-gray-300 mt-2 mb-6 text-center transition-opacity duration-[${ANIMATION_DURATION
                }] ${fade ? "opacity-100" : "opacity-0"}`}
            style={{ minHeight: 56 }} // prevents layout shift
        >
            {valueProps[index]}
        </p>
    );
};