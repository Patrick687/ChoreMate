const HeroSection: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <section className="bg-white rounded-2xl shadow-lg p-8 md:p-12 flex flex-col items-center max-w-xl w-full">
                {/* Optional Avatar */}
                <img
                    src="https://avatars.githubusercontent.com/u/your-github-id?v=4"
                    alt="Your Name"
                    className="w-24 h-24 rounded-full mb-6 shadow-md object-cover"
                />
                {/* Name & Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 text-center">
                    Hi, I’m <span className="text-blue-600">Patrick Klein</span>,<br />
                    a Full Stack Software Engineer
                </h1>
                {/* Value Prop */}
                <p className="text-lg text-gray-600 mt-2 mb-6 text-center">
                    I build practical, scalable web apps focused on user experience and performance.
                </p>
                {/* CTA Buttons */}
                <div className="flex gap-4">
                    <a
                        href="/resume.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
                    >
                        View Resume
                    </a>
                    <a
                        href="mailto:your.email@example.com"
                        className="px-6 py-2 rounded-lg border border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition"
                    >
                        Contact Me
                    </a>
                </div>
            </section>
        </div>
    );
};

export default HeroSection;