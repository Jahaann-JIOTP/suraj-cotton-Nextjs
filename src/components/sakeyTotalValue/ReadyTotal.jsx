import React from "react";

const ReadyTotalValues = ({ data = {} }) => {
  const dataLength = Object.keys(data).length;
  return (
    <div className="absolute bottom-3 left-3">
      {dataLength > 0 && (
        <div className="border border-gray-300 bg-white/80 dark:bg-gray-700 backdrop-blur-md px-4 py-3 rounded shadow-sm flex flex-col gap-1">
          {Object.entries(data).map(([key, value], idx) => (
            <span className="font-semibold text-sm" key={idx}>
              {key.replace(/_/g, " ")}:{" "}
              <span className="font-normal">{value.toFixed(2)}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReadyTotalValues;
