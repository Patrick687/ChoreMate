import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { openModal } from "../../store/modal";
import { useNavigate, NavLink } from "react-router-dom";
import { logout } from "../../store/auth";
import type { RootState } from "../../store/store";

const Header: React.FC = () => {
    const [dark, setDark] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = useSelector((state: RootState) => state.auth.token);

    useEffect(() => {
        if (dark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [dark]);

    return (
        <header className="flex flex-col md:flex-row items-center justify-between px-4 md:px-6 py-4 bg-white dark:bg-gray-800 shadow">
            <div
                className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-2 md:mb-0 cursor-pointer"
                onClick={() => navigate("/")}
            >
                Chore Mate
            </div>
            <nav className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 w-full md:w-auto items-center">
                {!token ? (
                    <>
                        <a
                            href="#features"
                            className="block md:hidden text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium"
                        >
                            Features
                        </a>
                        <a
                            href="#how"
                            className="block md:hidden text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium"
                        >
                            How It Works
                        </a>
                        <a
                            href="#login"
                            onClick={e => { e.preventDefault(); dispatch(openModal({ mode: "login" })); }}
                            className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium"
                        >
                            Login
                        </a>
                        <a
                            href="#signup"
                            onClick={e => { e.preventDefault(); dispatch(openModal({ mode: "signup" })); }}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-indigo-700 transition"
                        >
                            Sign Up
                        </a>
                    </>
                ) : (
                    <>
                        <NavLink
                            to="/dashboard"
                            className={({ isActive }) =>
                                `font-medium ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400"}`
                            }
                        >
                            Dashboard
                        </NavLink>
                        <NavLink
                            to="/groups"
                            className={({ isActive }) =>
                                `font-medium ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400"}`
                            }
                        >
                            Groups
                        </NavLink>
                        <NavLink
                            to="/chores"
                            className={({ isActive }) =>
                                `font-medium ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400"}`
                            }
                        >
                            My Chores
                        </NavLink>
                        <button
                            onClick={() => {
                                dispatch(logout());
                                navigate("/");
                            }}
                            className="ml-2 px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold transition"
                        >
                            Logout
                        </button>
                    </>
                )}
                <button
                    onClick={() => setDark((d) => !d)}
                    className="ml-4 px-3 py-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold transition"
                    aria-label="Toggle dark mode"
                >
                    {dark ? "🌙" : "☀️"}
                </button>
            </nav>
        </header>
    );
};

export default Header;