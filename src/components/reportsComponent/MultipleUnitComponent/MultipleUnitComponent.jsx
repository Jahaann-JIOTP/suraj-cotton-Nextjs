const MultipleUnitComponent = ({
  unit,
  startDate,
  endDate,
  unit4Spindle,
  unit5Spindle,
  resData,
}) => {
  const data = resData[0];
  const u4U5Total = {};
  for (const key in data) {
    const match = key.match(/^unit_([45])(.+?)_consumption$/);
    if (match) {
      const unit = match[1];
      const machine = match[2].toLowerCase();
      if (!u4U5Total[machine]) u4U5Total[machine] = 0;
      u4U5Total[machine] += data[key];
    }
  }
  // total of unit 4 and unit 5
  let unit4Total = 0;
  let unit5Total = 0;
  Object.entries(data).forEach(([key, value]) => {
    if (key.startsWith("unit_4") && typeof value === "number") {
      unit4Total += value;
    }
    if (key.startsWith("unit_5") && typeof value === "number") {
      unit5Total += value;
    }
  });
  // all total of unit + Unit 5
  let allTotalofU4U5Sum = unit4Total + unit5Total;
  const tableData = [
    {
      dept: "Blow Room",
      u4Mcs: 1,
      u5Mcs: 1,
      u4Load: 151.0,
      u5Load: 151.0,
      u4Consumption: data.unit_4blowroom_consumption,
      u5Consumption: data.unit_5blowroom_consumption,
      u4andU5TotalConsumption: u4U5Total.blowroom,
    },
    {
      dept: "Card(TC03@60kg&TC15@82Kg/hr)",
      u4Mcs: 14,
      u5Mcs: 14,
      u4Load: 19.0,
      u5Load: 19.0,
      u4Consumption: data.unit_4card_consumption,
      u5Consumption: data.unit_5card_consumption,
      u4andU5TotalConsumption: u4U5Total.Card,
    },
    {
      dept: "Comber",
      u4Mcs: 9,
      u5Mcs: 9,
      u4Load: 6.2,
      u5Load: 6.2,
      u4Consumption: data.unit_4comber_consumption,
      u5Consumption: data.unit_5comber_consumption,
      u4andU5TotalConsumption: u4U5Total.comber,
    },
    {
      dept: "Drawing",
      u4Mcs: 6,
      u5Mcs: 6,
      u4Load: 13.6,
      u5Load: 13.6,
      u4Consumption: data.unit_4Drawing_consumption,
      u5Consumption: data.unit_5Drawing_consumption,
      u4andU5TotalConsumption: u4U5Total.drawing,
    },
    {
      dept: "simplex",
      u4Mcs: 6,
      u5Mcs: 6,
      u4Load: 16.5,
      u5Load: 16.5,
      u4Consumption: data.unit_4Simplex_consumption,
      u5Consumption: data.unit_5Simplex_consumption,
      u4andU5TotalConsumption: u4U5Total.simplex,
    },
    {
      dept: "R Transport System",
      u4Mcs: 0,
      u5Mcs: 0,
      u4Load: 0,
      u5Load: 0,
      u4Consumption: data.unit_4RTransportSystem_consumption,
      u5Consumption: data.unit_5RTransportSystem_consumption,
      u4andU5TotalConsumption: u4U5Total.rtransportsystem,
    },
    {
      dept: "Ring Dept",
      u4Mcs: 24,
      u5Mcs: 24,
      u4Load: 80.0,
      u5Load: 80.0,
      u4Consumption: data.unit_4Ring_consumption,
      u5Consumption: data.unit_5Ring_consumption,
      u4andU5TotalConsumption: u4U5Total.ring,
    },
    {
      dept: "Auto Cone",
      u4Mcs: 8,
      u5Mcs: 8,
      u4Load: 30.0,
      u5Load: 30.0,
      u4Consumption: data.unit_4AutoCone_consumption,
      u5Consumption: data.unit_5AutoCone_consumption,
      u4andU5TotalConsumption: u4U5Total.autocone,
    },
    {
      dept: "Air Compressor",
      u4Mcs: 3,
      u5Mcs: 3,
      u4Load: 119.0,
      u5Load: 119.0,
      u4Consumption: data.unit_4AirCompressor_consumption,
      u5Consumption: data.unit_5AirCompressor_consumption,
      u4andU5TotalConsumption: u4U5Total.aircompressor,
    },
    {
      dept: "Deep weel turbine",
      u4Mcs: 1,
      u5Mcs: 1,
      u4Load: 22.0,
      u5Load: 22.0,
      u4Consumption: data.unit_4Turbine_consumption,
      u5Consumption: data.unit_5Turbine_consumption,
      u4andU5TotalConsumption: u4U5Total.turbine,
    },
    {
      dept: "bailing press",
      u4Mcs: 1,
      u5Mcs: 1,
      u4Load: 15.0,
      u5Load: 15.0,
      u4Consumption: data.unit_4BailingPress_consumption,
      u5Consumption: data.unit_5BailingPress_consumption,
      u4andU5TotalConsumption: u4U5Total.bailingpress,
    },
    {
      dept: "Residential Colony",
      u4Mcs: 0,
      u5Mcs: 0,
      u4Load: 30.0,
      u5Load: 30.0,
      u4Consumption: data.unit_4Residentialcolony_consumption,
      u5Consumption: data.unit_5Residentialcolony_consumption,
      u4andU5TotalConsumption: u4U5Total.residentialcolony,
    },
    {
      dept: "spare",
      u4Mcs: 0,
      u5Mcs: 0,
      u4Load: 0,
      u5Load: 0,
      u4Consumption: data.unit_4Spare_consumption,
      u5Consumption: data.unit_5Spare_consumption,
      u4andU5TotalConsumption: u4U5Total.spare,
    },
    {
      dept: "Winding",
      u4Mcs: 0,
      u5Mcs: 0,
      u4Load: 0,
      u5Load: 0,
      u4Consumption: data.unit_4Winding_consumption,
      u5Consumption: data.unit_5Winding_consumption,
      u4andU5TotalConsumption: u4U5Total.winding,
    },
    {
      dept: "Bypass",
      u4Mcs: 0,
      u5Mcs: 0,
      u4Load: 0,
      u5Load: 0,
      u4Consumption: data.unit_4Bypass_consumption,
      u5Consumption: data.unit_5Bypass_consumption,
      u4andU5TotalConsumption: u4U5Total.bypass,
    },
    {
      dept: "packing",
      u4Mcs: 0,
      u5Mcs: 0,
      u4Load: 0,
      u5Load: 0,
      u4Consumption: data.unit_4Packing_consumption,
      u5Consumption: data.unit_5Packing_consumption,
      u4andU5TotalConsumption: u4U5Total.packing,
    },
    {
      dept: "lab",
      u4Mcs: 0,
      u5Mcs: 0,
      u4Load: 0,
      u5Load: 0,
      u4Consumption: data.unit_4Lab_consumption,
      u5Consumption: data.unit_5Lab_consumption,
      u4andU5TotalConsumption: u4U5Total.lab,
    },
    {
      dept: "Frame Finisher",
      u4Mcs: 0,
      u5Mcs: 0,
      u4Load: 0,
      u5Load: 0,
      u4Consumption: data.unit_4FrameFinisher_consumption,
      u5Consumption: data.unit_5FrameFinisher_consumption,
      u4andU5TotalConsumption: u4U5Total.framefinisher,
    },
    {
      dept: "A/C plant",
      u4Mcs: 0,
      u5Mcs: 0,
      u4Load: 0,
      u5Load: 0,
      u4Consumption: data.unit_4ACPlant_consumption,
      u5Consumption: data.unit_5ACPlant_consumption,
      u4andU5TotalConsumption: u4U5Total.acplant,
    },
    {
      dept: "fiber deposit",
      u4Mcs: 0,
      u5Mcs: 0,
      u4Load: 0,
      u5Load: 0,
      u4Consumption: data.unit_4Fiberdeposit_consumption,
      u5Consumption: data.unit_5Fiberdeposit_consumption,
      u4andU5TotalConsumption: u4U5Total.fiberdeposit,
    },
    {
      dept: "yarn",
      u4Mcs: 0,
      u5Mcs: 0,
      u4Load: 0,
      u5Load: 0,
      u4Consumption: data.unit_4Yarn_consumption,
      u5Consumption: data.unit_5Yarn_consumption,
      u4andU5TotalConsumption: u4U5Total.yarn,
    },
    {
      dept: "water chiller",
      u4Mcs: 0,
      u5Mcs: 0,
      u4Load: 0,
      u5Load: 0,
      u4Consumption: data.unit_4WaterChiller_consumption,
      u5Consumption: data.unit_5WaterChiller_consumption,
      u4andU5TotalConsumption: u4U5Total.waterchiller,
    },
    {
      dept: "HFO 2nd source",
      u4Mcs: 9,
      u5Mcs: 9,
      u4Load: 6.2,
      u5Load: 6.2,
      u4Consumption: data.unit_4HFO2ndSource_consumption,
      u5Consumption: data.unit_5HFO2ndSource_consumption,
      u4andU5TotalConsumption: u4U5Total.hfo2ndsource,
    },
    {
      dept: "lighting",
      u4Mcs: 0,
      u5Mcs: 0,
      u4Load: 0,
      u5Load: 0,
      u4Consumption: data.unit_4Lightning_consumption,
      u5Consumption: data.unit_5Lightning_consumption,
      u4andU5TotalConsumption: u4U5Total.lightning,
    },
    {
      dept: "aux unit",
      u4Mcs: 0,
      u5Mcs: 0,
      u4Load: 0,
      u5Load: 0,
      u4Consumption: data.unit_4AuxUnit5_consumption,
      u5Consumption: data.unit_5AuxUnit5_consumption,
      u4andU5TotalConsumption: u4U5Total.auxunit5,
    },
  ];

  return (
    <>
      <div className="flex px-3 md:px-6 pt-2 flex-col gap-3 overflow-hidden">
        <h2 className="text-[18.22px] font-600 font-raleway">
          Energy Usage Report
        </h2>
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
      <div className="px-3 md:px-6 ">
        <h2 className="text-[18.62px] pb-4 font-inter font-500">
          {unit === "unit4" ? "Unit 4" : unit === "unit5" ? "Unit 5" : ""}
        </h2>

        <div className="w-full overflow-x-auto custom-scrollbar-report">
          <div className="flex gap-1 flex-col h-[23rem] mb-1 w-full max-w-full overflow-x-auto md:overflow-x-auto lg:overflow-x-visible custom-scrollbar-report">
            {/* ------------------- */}
            <div className="min-w-[1024px] lg:min-w-full flex justify-end gap-[1rem]">
              <div className="w-[17rem] lg:w-[32.5%] flex items-center gap-2">
                <div className="w-[47.5%] relative h-[1px] bg-black dark:bg-gray-500">
                  <div className="absolute w-[1px] h-[10px] bg-black dark:bg-gray-500 top-[-4px] left-0"></div>
                </div>
                <div className="w-[15%] font-500 font-inter text-[12px] text-center">
                  Unti 4
                </div>
                <div className="w-[45%] h-[1px] relative bg-black dark:bg-gray-500">
                  <div className="absolute w-[1px] h-[10px] bg-black dark:bg-gray-500 top-[-4px] right-0"></div>
                </div>
              </div>
              <div className="w-[23.5rem] lg:w-[37.05%] flex items-center gap-2">
                <div className="w-[47.5%] h-[1px] bg-black dark:bg-gray-500 relative">
                  <div className="absolute w-[1px] h-[10px] bg-black dark:bg-gray-500 top-[-4px] left-0"></div>
                </div>
                <div className="w-[10%] font-500 font-inter text-[12px] text-center">
                  Unti 5
                </div>
                <div className="w-[45%] h-[1px] bg-black dark:bg-gray-500 relative">
                  <div className="absolute w-[1px] h-[10px] bg-black dark:bg-gray-500 top-[-4px] right-0"></div>
                </div>
              </div>
              <div className="w-[7.5rem] lg:w-[16.5%] flex items-center">
                <div className="w-[30%] h-[1px] bg-black dark:bg-gray-500 relative">
                  <div className="absolute w-[1px] h-[10px] bg-black dark:bg-gray-500 top-[-4px] left-0"></div>
                </div>
                <div className="w-[40%] font-500 font-inter text-[12px] text-center">
                  Unti 4 + Unit 5
                </div>
                <div className="w-[28%] h-[1px] bg-black dark:bg-gray-500 relative">
                  <div className="absolute w-[1px] h-[10px] bg-black dark:bg-gray-500 top-[-4px] right-0"></div>
                </div>
              </div>
            </div>
            {/* ------------------- */}
            <div className="">
              <div className="flex-nowrap dark:border-gray-500 flex gap-4 min-w-[1024px] lg:min-w-full">
                <table className="table w-full border-collapse border border-gray-300 dark:border-gray-500">
                  <thead className="bg-[#E5F3FD] dark:bg-[#e5f3fd4f] w-full z-10">
                    <tr className="border border-gray-300 dark:border-gray-500">
                      <th className="border border-gray-300 dark:border-gray-500  px-2 py-1 text-[12px] font-inter font-semibold">
                        Department
                      </th>
                      <th className="border border-gray-300 dark:border-gray-500  px-2 py-1 text-[12px] font-inter font-semibold">
                        Mcs
                      </th>
                      <th className="border border-gray-300 dark:border-gray-500 px-2 py-1 text-[12px] font-inter font-semibold">
                        Installed Load Kw
                      </th>
                      <th className="border border-gray-300 dark:border-gray-500 px-2 py-1 text-[12px] font-inter font-semibold">
                        Consumed units Kwh
                      </th>
                      <th className=" border-b-1 border-white dark:border-gray-800 bg-white dark:bg-gray-800  px-[5px] py-1 text-[12px] font-inter font-semibold"></th>
                      <th className="border border-gray-300 dark:border-gray-500 px-2 py-1 text-[12px] font-inter font-semibold">
                        Mcs
                      </th>
                      <th className="border border-gray-300 dark:border-gray-500 px-2 py-1 text-[12px] font-inter font-semibold">
                        Intalled Load Kwh
                      </th>
                      <th className="border border-gray-300 dark:border-gray-500 px-2 py-1 text-[12px] font-inter font-semibold">
                        Consumed Units Kwh
                      </th>
                      <th className=" border-b-1 border-white dark:border-gray-800 bg-white dark:bg-gray-800  px-[5px] py-1 text-[12px] font-inter font-semibold"></th>
                      <th className="border font-semibold border-gray-300 dark:border-gray-500  px-2 py-1 text-[12px] font-inter">
                        Total Consumed Units Kw
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row, index) => (
                      <tr
                        key={index}
                        className="h-[27px] text-[12px] font-inter font-400"
                      >
                        <td className="px-2 py-1 border border-gray-300 dark:border-gray-500   text-[12px] font-inter font-400">
                          {row.dept}
                        </td>
                        <td className="px-2 py-1 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] border border-gray-300 text-[12px] font-inter font-400 dark:border-gray-500 text-center">
                          {row.u4Mcs}
                        </td>
                        <td className="px-2 py-1 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] border border-gray-300 text-[12px] font-inter font-400 dark:border-gray-500 text-center">
                          {row.u4Load}
                        </td>
                        <td className="px-[5px] py-1 text-center border border-gray-300 dark:border-gray-500 text-[12px] font-inter font-400">
                          {row.u4Consumption || 0}
                        </td>
                        <td className="px-[5px] py-1 border-r-1 border-gray-300 dark:border-gray-500 text-center text-[12px] font-inter font-400"></td>
                        <td className="px-2 py-1 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] border border-gray-300 text-[12px] font-inter font-400 dark:border-gray-500  text-center">
                          {row.u5Mcs}
                        </td>
                        <td className="px-2 py-1 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] border border-gray-300 text-[12px] font-inter font-400 dark:border-gray-500  text-center">
                          {row.u5Load}
                        </td>
                        <td className="px-2 py-1 text-center border border-gray-300 dark:border-gray-500  text-[12px] font-inter font-400">
                          {row.u5Consumption || 0}
                        </td>
                        <td className="px-[5px] py-1 text-center border-r-1 text-[12px] font-inter font-400"></td>
                        <td className="px-2 py-1 text-center border border-gray-300 dark:border-gray-500 text-[12px] font-inter font-400">
                          {row.u4andU5TotalConsumption || 0}
                        </td>
                      </tr>
                    ))}
                    <tr className="h-[27px] text-[12px] font-inter font-semibold">
                      <td className="px-2 py-1 border border-gray-300 dark:border-gray-500   text-[12px] font-inter font-semibold">
                        Total Load
                      </td>
                      <td className="px-2 py-1"></td>
                      <td className="px-2 py-1"></td>
                      <td className="px-[5px] py-1 text-center border-r-1 border-gray-300 dark:border-gray-500 text-[12px] font-inter font-semibold">
                        {unit4Total.toFixed(2)}
                      </td>
                      <td className="px-[5px] py-1 border-r-1 border-gray-300 dark:border-gray-500 text-center text-[12px] font-inter font-semibold"></td>
                      <td className="px-2 py-1"></td>
                      <td className="px-2 py-1"></td>
                      <td className="px-2 py-1 text-center border border-gray-300 dark:border-gray-500  text-[12px] font-inter font-semibold">
                        {unit5Total.toFixed(2)}
                      </td>
                      <td className="px-[5px] py-1 text-center border-r-1 text-[12px] font-inter font-semibold"></td>
                      <td className="px-2 py-1 text-center border border-gray-300 dark:border-gray-500 text-[12px] font-inter font-semibold">
                        {allTotalofU4U5Sum.toFixed(2)}
                      </td>
                    </tr>
                    <tr className="h-[27px] border border-gray-300 dark:border-gray-500 text-[12px] font-inter font-semibold">
                      <td className="px-2 py-1 border border-gray-300 dark:border-gray-500   text-[12px] font-inter font-semibold">
                        Total Spindles
                      </td>
                      <td className="px-2 py-1"></td>
                      <td className="px-2 py-1"></td>
                      <td className="px-[5px] py-1 text-center border-r-1 border-gray-300 dark:border-gray-500 text-[12px] font-inter font-semibold">
                        {unit4Spindle.toFixed(2)}
                      </td>
                      <td className="px-[5px] py-1 border-r-1 border-gray-300 dark:border-gray-500 text-center text-[12px] font-inter font-semibold"></td>
                      <td className="px-2 py-1"></td>
                      <td className="px-2 py-1"></td>
                      <td className="px-2 py-1 text-center border border-gray-300 dark:border-gray-500  text-[12px] font-inter font-semibold">
                        {unit5Spindle.toFixed(2)}
                      </td>
                      <td className="px-[5px] py-1 text-center border-r-1 text-[12px] font-inter font-semibold"></td>
                      <td className="px-2 py-1 text-center border border-gray-300 dark:border-gray-500 text-[12px] font-inter font-semibold">
                        {unit4Spindle + unit5Spindle}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MultipleUnitComponent;
