import React from "react";

const PowerSummaryTable = ({
  unit,
  startDate,
  endDate,
  tarifData,
  resData,
  unit4Spindle,
  unit5Spindle,
}) => {
  const wapda1Tarif = Number(tarifData.wapda1);
  const solar1Tarif = Number(tarifData.solar1);
  const solar2Tarif = Number(tarifData.solar2);
  const totalGenerationCost =
    unit === "Unit_4"
      ? resData.total_generation
      : unit === "Unit_5"
      ? resData.total_generation / 2
      : resData.total_generation / 3;
  const averageUnitcost =
    unit === "Unit_4"
      ? totalGenerationCost
      : unit === "Unit_5"
      ? totalGenerationCost / 2
      : totalGenerationCost / 3;
  return (
    <>
      <div className="flex  flex-col gap-3 overflow-hidden pt-3">
        <div className="flex flex-col md:flex-row items-start justify-between  w-full flex-wrap  gap-1">
          <div className="flex flex-col items-start justify-start md:w-[49%]">
            <span className="text-[14.22px] font-500 font-inter">
              Invoice To:
            </span>
            <span className="text-[14.22px] font-400 font-inter text-[#727272] dark:text-gray-400">
              Suraj Cotton Pvt. Limited
            </span>
          </div>
          <div className="flex flex-col items-start md:items-end gap-1 justify-start md:w-[49%]">
            <span className="text-[14.22px] font-500 font-inter">
              Jahaann Technologies
            </span>
            <span className="text-[14.22px] font-400 font-inter text-[#727272] dark:text-gray-400">
              22-C Block, G.E.C.H.S, Phase 3 Peco Road Lahore , Pakistan
            </span>
            <span className="text-[14.22px] font-400 font-inter text-[#727272] dark:text-gray-400">
              Phone: +923245894399
            </span>
          </div>
        </div>
      </div>
      <div className="w-full h-[2px] mt-5 bg-gradient-to-r from-transparent via-[#1A68B2]  to-transparent"></div>
      <div className="flex flex-col gap-2 md:flex-row px-3 md:px-6 items-start justify-between pt-5">
        <div>
          <button className="bg-[#1A68B2] cursor-pointer text-white py-1 px-5 rounded text-[14.22px] font-500 font-inter">
            Export
          </button>
        </div>
        <div className="flex flex-col items-start md:items-end justify-start">
          <span className="text-[14.22px] font-500 font-inter">
            Consumption Report
          </span>
          <span className="text-[14.22px] mt-2 font-400 font-inter text-[#727272] dark:text-gray-400">
            Start Date: {startDate}
          </span>
          <span className="text-[14.22px] font-400 font-inter text-[#727272] dark:text-gray-400">
            End date: {endDate}
          </span>
          <div>
            <span>Tarrif Rates:</span>
            <span className="text-[14.22px] font-400 font-inter text-[#727272] dark:text-gray-400">
              Tarrif Rates:
            </span>
          </div>
        </div>
      </div>
      {/* tables */}
      <div className="flex flex-col md:flex-row w-full justify-between">
        <div className="flex flex-col w-[49%] gap-2">
          <div className="w-full  custom-scrollbar-report">
            {/* generation table */}
            <table className="min-w-full border border-gray-200">
              <thead className="bg-[#E5F3FD]">
                <tr>
                  <th
                    colSpan="3"
                    className="text-center text-[15px] text-black font-500 border-b border-gray-200"
                  >
                    Generation
                  </th>
                </tr>
                <tr>
                  <th className="text-start pl-[3rem] text-[15px] text-black font-semibold w-[50%] border-1 border-gray-300">
                    Resources
                  </th>
                  <th className="text-center text-[15px] text-black font-semibold w-[25%] border-1 border-gray-300">
                    KW
                  </th>
                  <th className="text-center text-[15px] text-black font-semibold w-[25%] border-1 border-gray-300">
                    Cost
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(unit === "Unit_4" || unit === "ALL") && (
                  <tr>
                    <td className="w-[50%] pl-[3rem] border-1 border-gray-300 py-[1px]  text-[15px]  text-gray-900">
                      Wapda 1
                    </td>
                    <td className="text-center w-[25%] border-1 border-gray-300 py-[1px] text-[15px] text-gray-500">
                      {resData.wapda1}
                    </td>
                    <td className="text-center w-[25%] border-1 border-gray-300 py-[1px] text-[15px] text-gray-500">
                      {(resData.wapda1 * wapda1Tarif).toFixed(1)}
                    </td>
                  </tr>
                )}

                {/* <tr>
                  <td className="w-[50%] pl-[3rem] border-1 border-gray-300 py-[1px]  text-[15px]  text-gray-900">
                    Wapda 2
                  </td>
                  <td className="text-center w-[25%] border-1 border-gray-300 py-[1px] text-[15px] text-gray-500">
                    {resData.wapda2}
                  </td>
                  <td className="text-center w-[25%] border-1 border-gray-300 py-[1px] text-[15px] text-gray-500">
                    {tarifData.wapda2}
                  </td>
                </tr> */}
                {/* <tr>
                  <td className="w-[50%] pl-[3rem] border-1 border-gray-300 py-[1px]  text-[15px]  text-gray-900">
                    Niigata
                  </td>
                  <td className="text-center w-[25%] border-1 border-gray-300 py-[1px] text-[15px] text-gray-500">
                    888.87
                  </td>
                  <td className="text-center w-[25%] border-1 border-gray-300 py-[1px] text-[15px] text-gray-500">
                    888.87
                  </td>
                </tr> */}
                {/* <tr>
                  <td className="w-[50%] pl-[3rem] border-1 border-gray-300 py-[1px]  text-[15px]  text-gray-900">
                    JMS 1
                  </td>
                  <td className="text-center w-[25%] border-1 border-gray-300 py-[1px] text-[15px] text-gray-500">
                    888.87
                  </td>
                  <td className="text-center w-[25%] border-1 border-gray-300 py-[1px] text-[15px] text-gray-500">
                    888.87
                  </td>
                </tr> */}
                {/* <tr>
                  <td className="w-[50%] pl-[3rem] border-1 border-gray-300 py-[1px]  text-[15px]  text-gray-900">
                    GG
                  </td>
                  <td className="text-center w-[25%] border-1 border-gray-300 py-[1px] text-[15px] text-gray-500">
                    888.87
                  </td>
                  <td className="text-center w-[25%] border-1 border-gray-300 py-[1px] text-[15px] text-gray-500">
                    888.87
                  </td>
                </tr> */}
                {/* <tr>
                  <td className="w-[50%] pl-[3rem] border-1 border-gray-300 py-[1px]  text-[15px]  text-gray-900">
                    DG
                  </td>
                  <td className="text-center w-[25%] border-1 border-gray-300 py-[1px] text-[15px] text-gray-500">
                    888.87
                  </td>
                  <td className="text-center w-[25%] border-1 border-gray-300 py-[1px] text-[15px] text-gray-500">
                    888.87
                  </td>
                </tr> */}

                {(unit === "Unit_5" || unit === "ALL") && (
                  <>
                    <tr>
                      <td className="w-[50%] pl-[3rem] border-1 border-gray-300 py-[1px]  text-[15px]  text-gray-900">
                        Solar 1
                      </td>
                      <td className="text-center w-[25%] border-1 border-gray-300 py-[1px] text-[15px] text-gray-500">
                        {resData.solar1}
                      </td>
                      <td className="text-center w-[25%] border-1 border-gray-300 py-[1px] text-[15px] text-gray-500">
                        {((resData.solar1 * solar1Tarif) / 2).toFixed(1)}
                      </td>
                    </tr>
                    <tr>
                      <td className="w-[50%] pl-[3rem] border-1 border-gray-300 py-[1px]  text-[15px]  text-gray-900">
                        Solar 2
                      </td>
                      <td className="text-center w-[25%] border-1 border-gray-300 py-[1px] text-[15px] text-gray-500">
                        {resData.solar2}
                      </td>
                      <td className="text-center w-[25%] border-1 border-gray-300 py-[1px] text-[15px] text-gray-500">
                        {((resData.solar2 * solar2Tarif) / 2).toFixed(1)}
                      </td>
                    </tr>
                  </>
                )}

                <tr>
                  <td className="w-[50%] pl-[3rem] border-1 border-gray-300 py-[1px]  text-[15px]  text-black font-600">
                    Total
                  </td>
                  <td className="text-center w-[25%] border-1 border-gray-300 py-[1px] text-[15px] text-gray-500">
                    {resData.total_generation}
                  </td>
                  <td className="text-center w-[25%] border-1 border-gray-300 py-[1px] text-[15px] text-gray-500">
                    {totalGenerationCost.toFixed(1)}
                  </td>
                </tr>
                <tr>
                  <td className="w-[50%] pl-[3rem] border-y-1 border-gray-300 py-[1px] text-[15px]  text-black font-600">
                    Average Unit Cost
                  </td>
                  <td className="text-center w-[25%] border-y-1 border-gray-300"></td>
                  <td className="text-center w-[25%] border-y-1 border-gray-300 py-[1px] text-[15px] text-gray-500 font-600">
                    {averageUnitcost.toFixed(1)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="">
            {/* production */}
            <table className="min-w-full border border-gray-200">
              <thead className="bg-[#E5F3FD]">
                <tr>
                  <th
                    colSpan="4"
                    className="text-center text-[15px] text-black font-500 border-1 border-gray-200"
                  >
                    Production
                  </th>
                </tr>
                <tr>
                  <th className="text-center text-[15px] text-black font-500 w-[25%] border-1 border-gray-300">
                    Plant
                  </th>
                  <th className="text-center text-[15px] text-black font-500 w-[25%] border-1 border-gray-300">
                    No. of Spindle
                  </th>
                  <th className="text-center text-[15px] text-black font-500 w-[25%] border-1 border-gray-300">
                    Kw/Spindle
                  </th>
                  <th className="text-center text-[15px] text-black font-500 w-[25%] border-1 border-gray-300">
                    Cost/Spindle
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(unit === "Unit_4" || unit === "ALL") && (
                  <tr>
                    <td className="w-[25%] pl-[3rem] border-y-1 border-gray-300  text-[15px]  text-gray-900">
                      Unit 4
                    </td>
                    <td className="text-center w-[25%] border-1 border-gray-300 text-[15px] text-gray-500">
                      {unit4Spindle}
                    </td>
                    <td className="text-center w-[25%] border-1 border-gray-300 text-[15px] text-gray-500">
                      {(resData.unit4_consumption / unit4Spindle).toFixed(2)}
                    </td>
                    <td className="text-center w-[25%] border-1 border-gray-300 text-[15px] text-gray-500">
                      00
                    </td>
                  </tr>
                )}
                {(unit === "Unit_5" || unit === "ALL") && (
                  <tr>
                    <td className="w-[25%] pl-[3rem] border-y-1 border-gray-300  text-[15px]  text-gray-900">
                      Unit 5
                    </td>
                    <td className="text-center w-[25%] border-1 border-gray-300 text-[15px] text-gray-500">
                      {unit5Spindle}
                    </td>
                    <td className="text-center w-[25%] border-1 border-gray-300 text-[15px] text-gray-500">
                      {(resData.unit4_consumption / unit5Spindle).toFixed(2)}
                    </td>
                    <td className="text-center w-[25%] border-1 border-gray-300 text-[15px] text-gray-500">
                      00
                    </td>
                  </tr>
                )}
                <tr>
                  <td className="w-[25%] pl-[3rem] border-y-1 border-gray-300  text-[15px]  text-gray-900">
                    Total
                  </td>
                  <td className="text-center w-[25%] border-1 border-gray-300 text-[15px] text-gray-500">
                    {unit4Spindle + unit5Spindle}
                  </td>
                  <td className="text-center w-[25%] border-1 border-gray-300 text-[15px] text-gray-500">
                    {(
                      (unit4Spindle + unit5Spindle) /
                      resData.total_consumption
                    ).toFixed(2)}
                  </td>
                  <td className="text-center w-[25%] border-1 border-gray-300 text-[15px] text-gray-500">
                    00
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="w-[49%] flex flex-col gap-2 overflow-y-auto h-[28rem] custom-scrollbar-report">
          <div>
            {/* Consumption */}
            <table className="min-w-full border border-gray-200">
              <thead className="bg-[#E5F3FD]">
                <tr>
                  <th
                    colSpan="3"
                    className="text-center text-[15px] text-black font-500 border-b border-gray-200"
                  >
                    Consumption
                  </th>
                </tr>
                <tr>
                  <th className="text-start pl-[3rem] text-[14px] text-black font-500 w-[50%] border-1 border-gray-300">
                    Resources
                  </th>
                  <th className="text-center text-[14px] text-black font-500 w-[25%] border-1 border-gray-300">
                    KW
                  </th>
                  <th className="text-center text-[14px] text-black font-500 w-[25%] border-1 border-gray-300">
                    Cost
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* <tr>
                  <td className="w-[50%] pl-[3rem] py-[1px] border-1 border-gray-300  text-[14.6px]  text-gray-900">
                    Power House Aux.
                  </td>
                  <td className="text-center w-[25%] py-[1px] border-1 border-gray-300 text-[14.6px] text-gray-500">
                    888.7
                  </td>
                  <td className="text-center w-[25%] py-[1px] border-1 border-gray-300 text-[14.6px] text-gray-500">
                    888.87
                  </td>
                </tr> */}
                {(unit === "Unit_4" || unit === "ALL") && (
                  <tr>
                    <td className="w-[50%] pl-[3rem] py-[1px] border-1 border-gray-300  text-[14.6px]  text-gray-900">
                      Unit 4
                    </td>
                    <td className="text-center w-[25%] py-[1px] border-1 border-gray-300 text-[14.6px] text-gray-500">
                      {resData.unit4_consumption}
                    </td>
                    <td className="text-center w-[25%] py-[1px] border-1 border-gray-300 text-[14.6px] text-gray-500">
                      {(resData.unit4_consumption / 4).toFixed(1)}
                    </td>
                  </tr>
                )}
                {(unit === "Unit_5" || unit === "ALL") && (
                  <tr>
                    <td className="w-[50%] pl-[3rem] py-[1px] border-1 border-gray-300  text-[14.6px]  text-gray-900">
                      Unit 5
                    </td>
                    <td className="text-center w-[25%] py-[1px] border-1 border-gray-300 text-[14.6px] text-gray-500">
                      {resData.unit5_consumption}
                    </td>
                    <td className="text-center w-[25%] py-[1px] border-1 border-gray-300 text-[14.6px] text-gray-500">
                      {(resData.unit5_consumption / 4).toFixed(1)}
                    </td>
                  </tr>
                )}
                <tr>
                  <td className="w-[50%] pl-[3rem] py-[1px] border-1 border-gray-300  text-[14.6px] font-500 text-black">
                    Total
                  </td>
                  <td className="text-center w-[25%] py-[1px] border-1 border-gray-300 text-[14.6px] text-gray-500">
                    {resData.total_consumption}
                  </td>
                  <td className="text-center w-[25%] py-[1px] border-1 border-gray-300 text-[14.6px] text-gray-500">
                    {(resData.total_consumption / 8).toFixed(1)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            {/* Miscellaneous */}
            <table className="min-w-full border border-gray-200">
              <thead className="bg-[#E5F3FD]">
                <tr>
                  <th
                    colSpan="3"
                    className="text-center text-[15px] text-black font-500 border-b border-gray-200"
                  >
                    Miscellaneous
                  </th>
                </tr>
                <tr>
                  <th className="text-start pl-[3rem] text-[14px] text-black font-500 w-[50%] border-1 border-gray-300">
                    Resources
                  </th>
                  <th className="text-center text-[14px] text-black font-500 w-[25%] border-1 border-gray-300">
                    KW
                  </th>
                  <th className="text-center text-[14px] text-black font-500 w-[25%] border-1 border-gray-300">
                    Cost
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(unit === "Unit_4" || unit === "ALL") && (
                  <tr>
                    <td className="w-[50%] pl-[3rem] py-[1px] border-1 border-gray-300  text-[15px]  text-gray-900">
                      Wapda Export
                    </td>
                    <td className="text-center w-[25%] py-[1px] border-1 border-gray-300 text-[15px] text-gray-500">
                      {resData.wapdaexport}
                    </td>
                    <td className="text-center w-[25%] py-[1px] border-1 border-gray-300 text-[15px] text-gray-500">
                      {resData.wapdaexport}
                    </td>
                  </tr>
                )}
                <tr>
                  <td className="w-[50%] pl-[3rem] py-[1px] border-1 border-gray-300  text-[15px]  text-gray-900">
                    Unaccountable Energy
                  </td>
                  <td className="text-center w-[25%] py-[1px] border-1 border-gray-300 text-[15px] text-gray-500">
                    {resData.unaccountable_energy}
                  </td>
                  <td className="text-center w-[25%] py-[1px] border-1 border-gray-300 text-[15px] text-gray-500">
                    {(resData.unaccountable_energy / 2).toFixed(1)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            {/* Trans. / Traffo Losses */}
            {(unit === "Unit_5" || unit === "ALL") && (
              <table className="min-w-full border border-gray-200">
                <thead className="bg-[#E5F3FD]">
                  <tr>
                    <th
                      colSpan="3"
                      className="text-center text-[15px] text-black font-500 border-b border-gray-200"
                    >
                      Trans. / Traffo Losses
                    </th>
                  </tr>
                  <tr>
                    <th className="text-start pl-[3rem] text-[14px] text-black font-500 w-[50%] border-1 border-gray-300">
                      Resources
                    </th>
                    <th className="text-center text-[14px] text-black font-500 w-[25%] border-1 border-gray-300">
                      KW
                    </th>
                    <th className="text-center text-[14px] text-black font-500 w-[25%] border-1 border-gray-300">
                      Cost
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="w-[50%] pl-[3rem] py-[0.5px] border-1 border-gray-300  text-[15px]  text-gray-900">
                      TF1
                    </td>
                    <td className="text-center w-[25%] py-[0.5px] border-1 border-gray-300 text-[15px] text-gray-500">
                      {resData.trafo1Loss}
                    </td>
                    <td className="text-center w-[25%] py-[0.5px] border-1 border-gray-300 text-[15px] text-gray-500">
                      {(resData.trafo1Loss / 2).toFixed(1)}
                    </td>
                  </tr>
                  <tr>
                    <td className="w-[50%] pl-[3rem] py-[0.5px] border-1 border-gray-300  text-[15px]  text-gray-900">
                      TF2
                    </td>
                    <td className="text-center w-[25%] py-[0.5px] border-1 border-gray-300 text-[15px] text-gray-500">
                      {resData.trafo2Loss}
                    </td>
                    <td className="text-center w-[25%] py-[0.5px] border-1 border-gray-300 text-[15px] text-gray-500">
                      {(resData.trafo2Loss / 2).toFixed(1)}
                    </td>
                  </tr>
                  <tr>
                    <td className="w-[50%] pl-[3rem] py-[0.5px] border-1 border-gray-300  text-[15px]  text-gray-900">
                      TF3
                    </td>
                    <td className="text-center w-[25%] py-[0.5px] border-1 border-gray-300 text-[15px] text-gray-500">
                      {resData.trafo3Loss}
                    </td>
                    <td className="text-center w-[25%] py-[0.5px] border-1 border-gray-300 text-[15px] text-gray-500">
                      {(resData.trafo3Loss / 2).toFixed(1)}
                    </td>
                  </tr>
                  <tr>
                    <td className="w-[50%] pl-[3rem] py-[0.5px] border-1 border-gray-300  text-[15px]  text-gray-900">
                      TF4
                    </td>
                    <td className="text-center w-[25%] py-[0.5px] border-1 border-gray-300 text-[15px] text-gray-500">
                      {resData.trafo4Loss}
                    </td>
                    <td className="text-center w-[25%] py-[0.5px] border-1 border-gray-300 text-[15px] text-gray-500">
                      {(resData.trafo4Loss / 2).toFixed(1)}
                    </td>
                  </tr>
                  <tr>
                    <td className="w-[50%] pl-[3rem] py-[0.5px] border-1 border-gray-300  text-[15px] font-500  text-black">
                      Total
                    </td>
                    <td className="text-center w-[25%] py-[0.5px] border-1 border-gray-300 text-[15px] text-gray-500">
                      {resData.transformerLosses}
                    </td>
                    <td className="text-center w-[25%] py-[0.5px] border-1 border-gray-300 text-[15px] text-gray-500">
                      {(resData.transformerLosses / 8).toFixed(1)}
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PowerSummaryTable;
