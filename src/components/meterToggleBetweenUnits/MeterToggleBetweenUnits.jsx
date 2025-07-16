"use client";
import { useState } from "react";

const MeterToggleBetweenUnits = ({ onToggle }) => {
  const [isUnit4, setIsUnit4] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const toggleUnit = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500); // match animation duration

    setIsUnit4((prev) => {
      const newUnit4 = !prev;
      onToggle?.(newUnit4 ? "Unit 4" : "Unit 5"); // optional callback
      return newUnit4;
    });
  };

  return (
    <button
      onClick={toggleUnit}
      className={`w-[4rem] h-8 border-1 border-gray-500 cursor-pointer rounded px-1 flex items-center justify-between shadow-inner transition-colors duration-500`}
    >
      <span
        className={`
            w-7 h-7 rounded text-black dark:text-white bg-gray-800 shadow-md
            flex items-center justify-center
            transform transition-transform duration-500 ease-in-out
            ${isUnit4 ? "translate-x-0" : "translate-x-[1.7rem]"}
            `}
      >
        <span
          className={`text-[13px] text-green-500 font-semibold transition-transform duration-500 ease-in-out ${
            isAnimating ? "scale-110" : ""
          }`}
        >
          {isUnit4 ? "U4" : "U5"}
        </span>
      </span>
    </button>
  );
};

export default MeterToggleBetweenUnits;
