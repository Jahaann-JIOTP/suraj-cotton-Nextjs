import React from "react";
import { SectionHeader } from "./SectionHeader";

/**
 * Generic reusable table component
 * Supports: custom header order, total row, percent suffix, and highlighted columns
 */
const StandardTable = ({
  title = "",
  headers = [], // e.g. [{ key: "Total_I_C_G", label: "Total Incoming From Generation (kWh)" }]
  data = [],
  totalRow = null, // optional
  percentKeys = [], // e.g. ["UtilizationPercent"]
  highlightKeys = [], // e.g. ["Unit_4_consumptionperbag", "Unit_5_consumptionperbag"]
  firstColAlign = "center", // alignment for first column
}) => {
  return (
    <div className="w-full mt-5">
      {title && <SectionHeader title={title} />}
      <div className="w-full mt-3 overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-400 text-sm">
          {/* ---------- HEADER ---------- */}
          <thead className="bg-[#E5F3FD] dark:bg-gray-600">
            <tr className="text-[13px] md:text-[14px] font-inter">
              {headers.map((head, idx) => (
                <th
                  key={idx}
                  className="py-2 px-3 border border-gray-400 text-center"
                >
                  {head.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* ---------- BODY ---------- */}
          <tbody>
            {data.map((row, rIdx) => (
              <tr
                key={rIdx}
                className="text-[13px] md:text-[14px] font-inter hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {headers.map((h, cIdx) => {
                  const value = row[h.key];
                  const isPercent = percentKeys.includes(h.key);
                  const isHighlighted = highlightKeys.includes(h.key);
                  const alignClass =
                    cIdx === 0 ? `text-${firstColAlign}` : "text-right";
                  const bgClass = isHighlighted
                    ? "bg-[#E5F3FD] dark:bg-[#e5f3fd5d]"
                    : "";

                  return (
                    <td
                      key={h.key}
                      className={`py-2 px-3 border border-gray-400 ${alignClass} ${bgClass}`}
                    >
                      {typeof value === "number"
                        ? value.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }) + (isPercent ? " %" : "")
                        : value ?? "-"}
                    </td>
                  );
                })}
              </tr>
            ))}

            {/* ---------- TOTAL ROW (optional) ---------- */}
            {totalRow && (
              <tr className="font-semibold text-[13px] md:text-[14px] font-inter bg-gray-100 dark:bg-gray-700">
                {headers.map((h, idx) => {
                  const value = totalRow[h.key];
                  const alignClass =
                    idx === 0 ? `text-${firstColAlign}` : "text-right";
                  const isHighlighted = highlightKeys.includes(h.key);
                  const bgClass = isHighlighted
                    ? "bg-[#E5F3FD] dark:bg-[#e5f3fd5d]"
                    : "";
                  return (
                    <td
                      key={h.key}
                      className={`py-2 px-3 border border-gray-400 ${alignClass} ${bgClass}`}
                    >
                      {typeof value === "number"
                        ? value.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        : value ?? "-"}
                    </td>
                  );
                })}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StandardTable;
