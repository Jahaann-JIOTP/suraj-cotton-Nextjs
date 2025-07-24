"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { LuMoon } from "react-icons/lu";
import { LuSun } from "react-icons/lu";

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const isLight = theme === "light";
  const toggleTheme = () => {
    setIsAnimating(true);
    setTheme(isLight ? "dark" : "light");
    setTimeout(() => setIsAnimating(false), 50);
  };
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <button
      onClick={toggleTheme}
      className={`w-[4rem] h-8 bg-white cursor-pointer dark:bg-gray-800 rounded-full px-1 flex items-center justify-between shadow-inner transition-colors duration-500`}
    >
      <span
        className={`
          w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-950 shadow-md
          flex items-center justify-center
          transform transition-transform duration-500 ease-in-out
          ${isLight ? "translate-x-0" : "translate-x-[1.7rem]"}
        `}
      >
        {isLight ? (
          <LuSun
            className={`text-yellow-400 transition-transform duration-500 ease-in-out ${
              isAnimating ? "rotate-[360deg]" : "rotate-0"
            }`}
            size={20}
          />
        ) : (
          <LuMoon
            className={`text-indigo-500 transition-transform duration-500 ease-in-out ${
              isAnimating ? " rotate-[-360deg]" : "rotate-0"
            }`}
            size={20}
          />
        )}
      </span>
      <span
        className={`
          flex items-center justify-center
          transform transition-transform duration-500 ease-in-out
          ${isLight ? "translate-x-0" : "translate-x-[-2.2rem]"}
        `}
      >
        {isLight ? (
          <LuMoon
            className={`text-black transition-transform duration-500 ease-in-out ${
              isAnimating ? " rotate-[-360deg]" : "rotate-0"
            }`}
            size={18}
          />
        ) : (
          <LuSun
            className={`text-white transition-transform duration-500 ease-in-out ${
              isAnimating ? "rotate-[360deg]" : "rotate-0"
            }`}
            size={18}
          />
        )}
      </span>
    </button>
  );
};

export default ThemeSwitcher;
