import { Skeleton } from "@mui/material";
import React from "react";

const ReadyTotal = ({ data = {}, loading = false }) => {
  return (
    <div className="absolute bottom-3 left-3">
      <div className="border border-gray-300 bg-white/80 dark:bg-gray-700 backdrop-blur-md px-4 py-3 rounded shadow-sm flex flex-col gap-1">
        {Object.entries(data).map(([key, value]) => {
          return loading ? (
            <Skeleton
              key={key}
              animation="wave"
              variant="rounded"
              width={210}
              height={23}
            />
          ) : (
            <span key={key} className="font-semibold text-sm">
              {key.replace(/_/g, " ")}:{" "}
              <span className="font-normal">
                {value.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) ?? "-"}
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default ReadyTotal;
