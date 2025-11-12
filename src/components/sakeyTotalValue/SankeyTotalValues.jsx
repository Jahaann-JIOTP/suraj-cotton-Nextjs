import { load } from "@amcharts/amcharts4/.internal/core/utils/Net";
import { Skeleton } from "@mui/material";
import React from "react";

// ✅ Calculate generation, consumption & unaccounted
export function calculateSums(data, totalNode) {
  let generation = 0;
  let consumption = 0;
  let unaccounted = 0;

  for (let i = 0; i < data.length; i++) {
    const link = data[i];

    // Incoming links → generation
    if (link.to === totalNode) {
      generation += Number(link.value) || 0;
    }

    // Outgoing links → consumption (exclude unaccounted energy)
    if (link.from === totalNode) {
      if (link.to === "Unaccounted Energy") {
        unaccounted += Number(link.value) || 0; // capture separately
      } else {
        consumption += Number(link.value) || 0;
      }
    }
  }

  return { generation, consumption, unaccounted };
}

const SankeyTotalValues = ({ data, lt, loading = false }) => {
  const { generation, consumption, unaccounted } = calculateSums(data, lt);

  // only certain nodes hide the unaccounted field
  const isUnit =
    lt === "Unit 4 Incomer" ||
    lt === "Unit 5 Incomer" ||
    lt === "Losses" ||
    lt === "Total Generation";

  // recompute net unaccounted if not explicitly shown
  const netUnaccounted =
    unaccounted || generation - (consumption + unaccounted);

  return (
    <div className="absolute bottom-3 left-3">
      <div className="border border-gray-300 bg-white/80 dark:bg-gray-700 backdrop-blur-md px-4 py-3 rounded shadow-sm flex flex-col gap-1">
        {loading ? (
          <Skeleton
            animation="wave"
            variant="rounded"
            width={210}
            height={23}
          />
        ) : (
          <span className="font-semibold text-sm">
            Total Generation:{" "}
            <span className="font-normal">{generation.toFixed(2)}</span>
          </span>
        )}
        {loading ? (
          <Skeleton
            animation="wave"
            variant="rounded"
            width={210}
            height={23}
          />
        ) : (
          <span className="font-semibold text-sm">
            Total Consumption:{" "}
            <span className="font-normal">{consumption.toFixed(2)}</span>
          </span>
        )}
        {!isUnit &&
          (loading ? (
            <Skeleton
              animation="wave"
              variant="rounded"
              width={210}
              height={23}
            />
          ) : (
            <span className="font-semibold text-sm">
              Unaccounted Energy:{" "}
              <span className="font-normal">{unaccounted.toFixed(2)}</span>
            </span>
          ))}
      </div>
    </div>
  );
};

export default SankeyTotalValues;
