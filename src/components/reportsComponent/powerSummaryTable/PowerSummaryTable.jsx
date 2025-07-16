import React from "react";

const PowerSummaryTable = ({ unit, startDate, endDate }) => {
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
        </div>
      </div>
      {/* tables */}
      <div className="flex flex-col md:flex-row w-full justify-between">
        <div className="flex flex-col w-[49%] gap-2">
          <div className="w-full h-[17rem] overflow-y-auto custom-scrollbar-report">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-[#E5F3FD]">
                <tr>
                  <th
                    colSpan="2"
                    className="text-center text-[18px] text-black font-500 border-b border-gray-200"
                  >
                    Generation
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="py-2 w-[70%] pl-[3rem] border-1 border-gray-300  text-[15px]  text-gray-900">
                    Wapda 1
                  </td>
                  <td className="py-2 text-center w-[30%] border-1 border-gray-300 text-[15px] text-gray-500">
                    888.87
                  </td>
                </tr>
                <tr>
                  <td className="py-2 w-[70%] pl-[3rem] border-1 border-gray-300  text-[15px]  text-gray-900">
                    Wapda 1
                  </td>
                  <td className="py-2 text-center w-[30%] border-1 border-gray-300 text-[15px] text-gray-500">
                    888.87
                  </td>
                </tr>
                <tr>
                  <td className="py-2 w-[70%] pl-[3rem] border-1 border-gray-300  text-[15px]  text-gray-900">
                    Wapda 1
                  </td>
                  <td className="py-2 text-center w-[30%] border-1 border-gray-300 text-[15px] text-gray-500">
                    888.87
                  </td>
                </tr>
                <tr>
                  <td className="py-2 w-[70%] pl-[3rem] border-1 border-gray-300  text-[15px]  text-gray-900">
                    Wapda 1
                  </td>
                  <td className="py-2 text-center w-[30%] border-1 border-gray-300 text-[15px] text-gray-500">
                    888.87
                  </td>
                </tr>
                <tr>
                  <td className="py-2 w-[70%] pl-[3rem] border-1 border-gray-300  text-[15px]  text-gray-900">
                    Wapda 1
                  </td>
                  <td className="py-2 text-center w-[30%] border-1 border-gray-300 text-[15px] text-gray-500">
                    888.87
                  </td>
                </tr>
                <tr>
                  <td className="py-2 w-[70%] pl-[3rem] border-1 border-gray-300  text-[15px]  text-gray-900">
                    Wapda 1
                  </td>
                  <td className="py-2 text-center w-[30%] border-1 border-gray-300 text-[15px] text-gray-500">
                    888.87
                  </td>
                </tr>
                <tr>
                  <td className="py-2 w-[70%] pl-[3rem] border-1 border-gray-300  text-[15px]  text-gray-900">
                    Wapda 1
                  </td>
                  <td className="py-2 text-center w-[30%] border-1 border-gray-300 text-[15px] text-gray-500">
                    888.87
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-[#E5F3FD]">
                <tr>
                  <th
                    colSpan="3"
                    className="text-center text-[18px] text-black font-500 "
                  >
                    Production
                  </th>
                </tr>
                <tr>
                  <th className="text-center text-[16px] w-[33%] text-black font-500 border-1 border-gray-300">
                    Plant
                  </th>
                  <th className="text-center text-[16px] w-[33%] text-black font-500 border-1 border-gray-300">
                    No. of Spindle
                  </th>
                  <th className="text-center text-[16px] w-[33%] text-black font-500 border-1 border-gray-300">
                    Kw/Spindle
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="py-2 w-[33%] text-center border-1 border-gray-300  text-[15px]  text-gray-900">
                    Unit 4
                  </td>
                  <td className="py-2 text-center w-[33%] border-1 border-gray-300 text-[15px] text-gray-500">
                    53,880
                  </td>
                  <td className="py-2 text-center w-[33%] border-1 border-gray-300 text-[15px] text-gray-500">
                    53,880
                  </td>
                </tr>
                <tr>
                  <td className="py-2 w-[33%] text-center border-1 border-gray-300  text-[15px]  text-gray-900">
                    Unit 5
                  </td>
                  <td className="py-2 text-center w-[33%] border-1 border-gray-300 text-[15px] text-gray-500">
                    53,880
                  </td>
                  <td className="py-2 text-center w-[33%] border-1 border-gray-300 text-[15px] text-gray-500">
                    53,880
                  </td>
                </tr>
                <tr>
                  <td className="py-2 w-[33%] text-center border-1 border-gray-300 font-600  text-[15px]  text-gray-900">
                    Total
                  </td>
                  <td className="py-2 text-center w-[33%] border-1 border-gray-300 text-[15px] text-gray-500">
                    53,880
                  </td>
                  <td className="py-2 text-center w-[33%] border-1 border-gray-300 text-[15px] text-gray-500">
                    53,880
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="w-[49%] flex flex-col gap-2 overflow-y-auto h-[28rem] custom-scrollbar-report">
          <div>
            <table className="min-w-full border border-gray-200">
              <thead className="bg-[#E5F3FD]">
                <tr>
                  <th
                    colSpan="2"
                    className="text-center text-[18px] text-black font-500 border-b border-gray-200"
                  >
                    Consumption
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="py-2 w-[70%] pl-[3rem] border-1 border-gray-300  text-[15px]  text-gray-900">
                    Wapda 1
                  </td>
                  <td className="py-2 text-center w-[30%] border-1 border-gray-300 text-[15px] text-gray-500">
                    888.87
                  </td>
                </tr>
                <tr>
                  <td className="py-2 w-[70%] pl-[3rem] border-1 border-gray-300  text-[15px]  text-gray-900">
                    Wapda 1
                  </td>
                  <td className="py-2 text-center w-[30%] border-1 border-gray-300 text-[15px] text-gray-500">
                    888.87
                  </td>
                </tr>
                <tr>
                  <td className="py-2 w-[70%] pl-[3rem] border-1 border-gray-300  text-[15px]  text-gray-900">
                    Wapda 1
                  </td>
                  <td className="py-2 text-center w-[30%] border-1 border-gray-300 text-[15px] text-gray-500">
                    888.87
                  </td>
                </tr>
                <tr>
                  <td className="py-2 w-[70%] pl-[3rem] border-1 border-gray-300  text-[15px]  text-gray-900">
                    Wapda 1
                  </td>
                  <td className="py-2 text-center w-[30%] border-1 border-gray-300 text-[15px] text-gray-500">
                    888.87
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <table className="min-w-full border border-gray-200">
              <thead className="bg-[#E5F3FD]">
                <tr>
                  <th
                    colSpan="2"
                    className="text-center text-[18px] text-black font-500 border-b border-gray-200"
                  >
                    Miscellaneous
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="py-2 w-[70%] pl-[3rem] border-1 border-gray-300  text-[15px]  text-gray-900">
                    Wapda 1
                  </td>
                  <td className="py-2 text-center w-[30%] border-1 border-gray-300 text-[15px] text-gray-500">
                    888.87
                  </td>
                </tr>
                <tr>
                  <td className="py-2 w-[70%] pl-[3rem] border-1 border-gray-300  text-[15px]  text-gray-900">
                    Wapda 1
                  </td>
                  <td className="py-2 text-center w-[30%] border-1 border-gray-300 text-[15px] text-gray-500">
                    888.87
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <table className="min-w-full border border-gray-200">
              <thead className="bg-[#E5F3FD]">
                <tr>
                  <th
                    colSpan="2"
                    className="text-center text-[18px] text-black font-500 border-b border-gray-200"
                  >
                    Trans. / Traffo Losses
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="py-2 w-[70%] pl-[3rem] border-1 border-gray-300  text-[15px]  text-gray-900">
                    Wapda 1
                  </td>
                  <td className="py-2 text-center w-[30%] border-1 border-gray-300 text-[15px] text-gray-500">
                    888.87
                  </td>
                </tr>
                <tr>
                  <td className="py-2 w-[70%] pl-[3rem] border-1 border-gray-300  text-[15px]  text-gray-900">
                    Wapda 1
                  </td>
                  <td className="py-2 text-center w-[30%] border-1 border-gray-300 text-[15px] text-gray-500">
                    888.87
                  </td>
                </tr>
                <tr>
                  <td className="py-2 w-[70%] pl-[3rem] border-1 border-gray-300  text-[15px]  text-gray-900">
                    Wapda 1
                  </td>
                  <td className="py-2 text-center w-[30%] border-1 border-gray-300 text-[15px] text-gray-500">
                    888.87
                  </td>
                </tr>
                <tr>
                  <td className="py-2 w-[70%] pl-[3rem] border-1 border-gray-300  text-[15px]  text-gray-900">
                    Wapda 1
                  </td>
                  <td className="py-2 text-center w-[30%] border-1 border-gray-300 text-[15px] text-gray-500">
                    888.87
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default PowerSummaryTable;
