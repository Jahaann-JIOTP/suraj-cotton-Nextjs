import React from "react";
import { SectionHeader } from "./SectionHeader";

const KayValueTable = ({
  title = "",
  data = {},
  isSingleCol = false,
  unit = "",
}) => {
  return (
    <div className="w-full mt-5">
      {title.length > 0 && <SectionHeader title={title} />}
      <div className="w-full mt-3 overflow-x-auto">
        <table
          className={`border${
            isSingleCol ? "w-[50%] lg:w-[20%]" : "w-full lg:w-[40%]"
          } overflow-hidden`}
        >
          <tbody>
            {Object.entries(data).map(([key, value], idx) => {
              let hilightedCell = "";
              if (isSingleCol === true) {
                if (idx === 0) {
                  hilightedCell = "bg-[#E5F3FD] dark:bg-gray-600";
                } else {
                  hilightedCell = "bg-transparent";
                }
              } else {
                hilightedCell = "bg-[#E5F3FD] dark:bg-gray-600";
              }
              return (
                <tr key={idx} className="text-[14px] font-inter">
                  <td
                    // className={`font-semibold py-1 px-2 border border-gray-400 dark:border-gray-500 w-[50%]`}
                    className={`${hilightedCell} font-semibold py-1 px-2 border border-gray-400 w-[50%]`}
                  >
                    {key.replace(/_/g, " ")}
                  </td>
                  {!isSingleCol && (
                    <td className="py-1 px-4 border border-gray-400 dark:border-gray-500 text-left">
                      {typeof value === "number"
                        ? value.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        : value ?? "-"}{" "}
                      {unit.length > 0 ? unit : ""}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KayValueTable;
