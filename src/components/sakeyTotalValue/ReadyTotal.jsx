import React from "react";

const ReadyTotal = ({ data = {}, loading = false }) => {
  return (
    <div className="absolute bottom-3 left-3">
      <div className="border border-gray-300 bg-white/80 dark:bg-gray-700 backdrop-blur-md px-4 py-3 rounded shadow-sm flex flex-col gap-1">
        {loading
          ? // Show 3 skeleton loaders when loading
            Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="w-[210px] h-[23px] rounded bg-gray-300 animate-pulse"
              ></div>
            ))
          : // Show actual data when not loading
            Object.entries(data).map(([key, value]) => (
              <span key={key} className="font-semibold text-sm">
                {key.replace(/_/g, " ")}:{" "}
                <span className="font-normal">
                  {typeof value === "number"
                    ? value.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : value ?? "-"}
                </span>
              </span>
            ))}
      </div>
    </div>
  );
};

export default ReadyTotal;
