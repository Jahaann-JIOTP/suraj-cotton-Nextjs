import React from "react";
const meterNames = {
  U1_PLC: "Transport",
  U2_PLC: "Unit 05 Aux",
  U3_PLC: "Light External",
  U4_PLC: "Light Internal ",
  U5_PLC: "Power House 2nd Source",
  U6_PLC: "Turbine",
  U7_PLC: "Spare",
  U8_PLC: "Drawing 01",
  U9_PLC: "Winding 01",
  U10_PLC: "Ring 01",
  U11_PLC: "Ring 5",
  U12_PLC: "Ring 6(Auto Cone 1-9)",
  U13_PLC: "Comber 1",
  U14_PLC: "Compressor",
  U15_PLC: "Simplex 01",
  U16_PLC: "Compressor 02 (90kW)",
  U17_PLC: "Ring AC ",
  U18_PLC: "Ring AC (Bypass)",
  U19_PLC: "Diesel + Gas Incoming ",
  U20_PLC: "Compressor (Bypass)",
  U21_PLC: "Wapda + HFO + Gas Incoming ",
  U1_GW01: "Drying Simplex AC",
  U2_GW01: "Weikel Conditioning Machine",
  U3_GW01: "Winding AC",
  U4_GW01: "Mills RES-CLNY& Workshop",
  U5_GW01: "Card 1",
  U6_GW01: "Colony ",
  U7_GW01: "Power House and Source",
  U8_GW01: "Blow Room",
  U9_GW01: "Card 2",
  U10_GW01: "Winding 01",
  U11_GW01: "Gas LT Panel",
  U12_GW01: "Card  Filter (Bypass)",
  U13_GW01: "Wapda + HFO + Gas Incoming ",
  U14_GW01: "D/R Card Filter",
  U15_GW01: "Ring 02 (Auto Cone 10-18)",
  U16_GW01: "Ring 04",
  U17_GW01: "Ring 03",
  U18_GW01: "Bale Press",
  U19_GW01: "AC Lab",
  U20_GW01: "Spare 01",
  U21_GW01: "Spare-02",
  U22_GW01: "HFO Incoming",
  U23_GW01: "Wapda 1 Incoming",
  //   unit 5 meters
  U1_GW02: "PDB CD1",
  U2_GW02: "PDB CD2",
  U3_GW02: "Card PDB 01 ",
  U4_GW02: "PDB 8 ",
  U5_GW02: "PF Panel",
  U6_GW02: "Solar",
  U7_GW02: "Ring 1-3",
  U8_GW02: "A/C Plant spinning",
  U9_GW02: "Blow Room L1",
  U10_GW02: "Ring Frames 4-6",
  U11_GW02: "A/C Plant Blowing",
  U12_GW02: "MLDB1 Blower room card",
  U13_GW02: "Transformer 1 LT -1 ACB ",
  U14_GW02: "Spare",
  U15_GW02: "AC Plant spinning",
  U16_GW02: "Water Chiller",
  U17_GW02: "Card M/C 8-14",
  U18_GW02: "Auto Con-link Conner 1-9",
  U19_GW02: "Card M/C 1-7",
  U20_GW02: "AC Plant winding",
  U21_GW02: "Simplex M/C S1-5",
  U22_GW02: "Spare",
  U23_GW02: "Draw Frame Finish",
  U1_GW03: "Ring Frame 7-9",
  U2_GW03: "Yarn Conditioning M/C",
  U3_GW03: "MLDB3 Single room quarter",
  U4_GW03: "Roving transport system",
  U5_GW03: "ring Frame 10-12",
  U6_GW03: "Comber MCS 1-14",
  U7_GW03: "Spare",
  U8_GW03: "Spare2",
  U9_GW03: "Ring Frame 13-15",
  U10_GW03: "Auto Con-linker Conner M/S 10-12",
  U11_GW03: "Baling Press ",
  U12_GW03: "Ring Frame 16-18",
  U13_GW03: "Fiber Deposit Plant",
  U14_GW03: "MLDB2 Ring Con",
  U15_GW03: "Deep Valve Turbine",
  U16_GW03: "Transformer 2 LT -2 ACB",
  U17_GW03: "Solar 2",
  U18_GW03: "PF Panel",
  U19_GW03: "wapda + HFO + Gas Incoming",
  U20_GW03: "WAPDA + HFO + Gas Outgoing T/F 3",
  U21_GW03: "WAPDA + HFO + Gas Outgoing T/F 4",
  U22_GW03: "PDB 07",
  U23_GW03: "PDB 10",
};

const EnergyCostReportsTable = ({
  startDate,
  endDate,
  energycostReportData,
  rates,
}) => {
  return (
    <div>
      <div className="flex  pt-2 flex-col gap-3 overflow-hidden">
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
      <div className="flex flex-col gap-2 md:flex-row items-start justify-between pt-5">
        <div>
          <button className="bg-[#1A68B2] cursor-pointer text-white py-1 px-5 rounded text-[14.22px] font-500 font-inter">
            Export
          </button>
        </div>
        <div className="flex flex-col items-start md:items-end justify-start">
          <span className="text-[14.22px] font-500 font-inter">
            Billing Report
          </span>
          <span className="text-[14.22px] mt-2 font-400 font-inter text-[#727272] dark:text-gray-400">
            Start Date: {startDate}
          </span>
          <span className="text-[14.22px] font-400 font-inter text-[#727272] dark:text-gray-400">
            End date: {endDate}
          </span>
          <span className="text-[14.22px] font-400 font-inter text-[#727272] dark:text-gray-400">
            Tarif Rate: {rates}
          </span>
        </div>
      </div>
      <div className="overflow-x-scroll mt-5 md:w-full md:overflow-x-hidden h-full md:max-h-[47vh] overflow-y-auto custom-scrollbar-report">
        <div className="w-full">
          <table className="table w-full border-collapse border ">
            <thead className="sticky top-0 bg-[#E5F3FD] dark:bg-gray-600 z-10">
              <tr className="border border-gray-300 dark:border-gray-500">
                <th className="border border-gray-300 dark:border-gray-500 w-[15%] px-2 py-1 text-[12px] font-inter font-700 text-center">
                  No.
                </th>
                <th className="border border-gray-300 dark:border-gray-500 w-[30%] px-2 py-1 text-[12px] font-inter font-700 text-center">
                  Sources
                </th>
                <th className="border border-gray-300 dark:border-gray-500 w-[30%] px-2 py-1 text-[12px] font-inter font-700 text-center">
                  KWH
                </th>
                <th className="border border-gray-300 dark:border-gray-500 w-[25%] px-2 py-1 text-[12px] font-inter font-700 text-center">
                  Total Price (PKR)
                </th>
              </tr>
            </thead>
            <tbody>
              {energycostReportData.map((item, index) => {
                const caluculatedRate = rates * item.consumption;
                return (
                  <tr
                    key={index}
                    className="border border-gray-300 dark:border-gray-500 text-[12px] font-inter font-400"
                  >
                    <td className="px-2 py-1 w-[15%] border bg-[#E5F3FD] dark:bg-gray-600 border-gray-300 dark:border-gray-500 text-center">
                      {index + 1}
                    </td>
                    <td className="px-2 py-1 w-[30%] border border-gray-300 dark:border-gray-500 text-center">
                      {meterNames[item.meterId] || item.meterId}
                    </td>
                    <td className="px-2 py-1 w-[30%] border border-gray-300 dark:border-gray-500 text-center">
                      {item.consumption.toFixed(2)}
                    </td>
                    <td className="px-2 py-1 w-[25%] text-center bg-[#E5F3FD] dark:bg-gray-600 border border-gray-300 dark:border-gray-500">
                      {caluculatedRate.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* todo: this is under discussion */}
        {/* <div className="flex flex-col bg-[#025697] mt-8 items-start justify-center text-white py-5 px-5">
          <span className="text-[16.22px] font-inter font-600">
            Report Summary:
          </span>
          <div>
            <span className="text-[14.22px] font-inter font-500">
              Wapda Import Cost:
            </span>
            <span className="text-[14.22px] font-inter font-500">5427.70</span>
          </div>
          <div>
            <span className="text-[14.22px] font-inter font-500">
              Wapda Export Saving:
            </span>
            <span className="text-[14.22px] font-inter font-500">5427.70</span>
          </div>
          <div>
            <span className="text-[14.22px] font-inter font-500">
              Solar Saving:
            </span>
            <span className="text-[14.22px] font-inter font-500">5427.70</span>
          </div>
          <div>
            <span className="text-[16.22px] font-inter font-600">
              Net Wapda Cost(Import - Export):
            </span>
            <span className="bg-white text-black py-[2px] px-3 rounded text-[16.22px] font-inter font-600">
              5427.70
            </span>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default EnergyCostReportsTable;
