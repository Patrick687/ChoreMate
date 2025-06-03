import React from "react";
import { FaGithub } from "react-icons/fa";

const projects = [
    {
        title: "Survivor Fantasy League",
        description: "Draft Survivor contestants with friends and compete as the season unfolds. Track picks, score points, and see who outlasts the rest!",
        tech: [
            "React",
            "TypeScript",
            "Redux Toolkit",
            "Tailwind CSS",
            "Node.js",
            "Express",
            "Sequelize",
            "PostgreSQL",
            "Swagger/OpenAPI"
        ],
        status: "In development",
        codeUrl: "https://github.com/Klein-Twins/Survivor-Fantasy-League",
        demoUrl: "",
        screenshot: "/budgetbuddy-screenshot.png",
    },
    {
        title: "ChoreMate",
        description: "A collaborative app for managing household chores and schedules.",
        tech: [
            "React",
            "TypeScript",
            "Tailwind CSS",
            "GraphQL",
            "Node.js",
            "Sequelize",
            "PostgreSQL"
        ],
        status: "In development",
        codeUrl: "https://github.com/Patrick687/ChoreMate",
        demoUrl: "",
        screenshot: "/choremate-screenshot.png",
    },
    // {
    //     title: "WeatherNow",
    //     description: "A minimal weather dashboard with real-time updates.",
    //     tech: ["React", "Vite", "OpenWeatherMap API"],
    //     status: "Live",
    //     codeUrl: "https://github.com/yourusername/weathernow",
    //     demoUrl: "https://weathernow-demo.vercel.app/",
    //     screenshot: "/weathernow-screenshot.png",
    // },
];

const statusColor = {
    "In development": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    "Demo coming soon": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    "Live": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
};

const Projects: React.FC = () => (
    <section className="w-full flex flex-col items-center py-12 bg-gray-50 dark:bg-gray-900 transition-colors">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Projects
        </h2>
        <div className="grid gap-8 md:grid-cols-2 w-full max-w-6xl px-4">
            {projects.map((proj, idx) => (
                <div
                    key={proj.title}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex flex-col p-6 transition-colors"
                >
                    {proj.screenshot && (
                        <img
                            src={proj.screenshot}
                            alt={`${proj.title} screenshot`}
                            className="rounded-lg mb-4 object-cover w-full h-40 bg-gray-200 dark:bg-gray-700"
                            style={{ objectFit: "cover" }}
                        />
                    )}
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{proj.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 h-16 mb-4">{proj.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                        {proj.tech.map((tech) => (
                            <span
                                key={tech}
                                className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs font-medium"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                    <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${statusColor[proj.status as keyof typeof statusColor]}`}
                    >
                        {proj.status}
                    </span>
                    <div className="flex justify-between items-center mt-auto">
                        <a
                            href={proj.codeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className=" rounded-lg text-gray-800 hover:text-gray-600 dark:text-gray-100 dark:hover:text-gray-300 font-semibold transition"
                        >
                            <FaGithub className="text-3xl" />
                        </a>
                        <a
                            href={proj.demoUrl || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`px-4 py-2 w-7/12 text-center rounded-lg font-semibold shadow transition ${proj.demoUrl
                                ? "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400"
                                }`}
                            tabIndex={proj.demoUrl ? 0 : -1}
                            aria-disabled={!proj.demoUrl}
                        >
                            {proj.demoUrl ? "Try it out" : "Coming soon..."}
                        </a>
                    </div>
                </div>
            ))}
        </div>
    </section>
);

export default Projects;