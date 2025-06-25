const tableData = [
  {
    department: "Blow Room",
    mcs: 1,
    consumedUnitKwh: 151.0,
    installedLoadKw: 1785.0,
  },
  {
    department: "Card(TC03@60kg&TC15@82Kg/hr)",
    mcs: 14,
    consumedUnitKwh: 19.0,
    installedLoadKw: 3998.4,
  },
  {
    department: "Comber",
    mcs: 9,
    consumedUnitKwh: 6.2,
    installedLoadKw: 415.8,
  },
  {
    department: "Uni Lap",
    mcs: 2,
    consumedUnitKwh: 11.8,
    installedLoadKw: 252.0,
  },
  {
    department: "Drawing(Finsher)",
    mcs: 6,
    consumedUnitKwh: 13.6,
    installedLoadKw: 331.2,
  },
  {
    department: "Drawing(Breaker)",
    mcs: 6,
    consumedUnitKwh: 9.0,
    installedLoadKw: 455.4,
  },
  {
    department: "Simplex",
    mcs: 6,
    consumedUnitKwh: 16.5,
    installedLoadKw: 1035.0,
  },
  {
    department: "R. Transport System",
    // mcs: 1,
    // consumedUnitKwh: 10,
    installedLoadKw: 120.0,
  },
  {
    department: "Auto Cone",
    mcs: 24,
    consumedUnitKwh: 80.0,
    installedLoadKw: 30240,
  },
  {
    department: "B/Card + Comber Filter",
    mcs: 8,
    consumedUnitKwh: 30.0,
    installedLoadKw: 3290.0,
  },
  {
    department: "A/C Back Process",
    // mcs: 1,
    consumedUnitKwh: 199.0,
    installedLoadKw: 2142.0,
  },
  {
    department: "A/C Ring",
    // mcs: 1,
    consumedUnitKwh: 138.0,
    installedLoadKw: 1980.0,
  },
  {
    department: "A/C Auto Cone",
    // mcs: 1,
    consumedUnitKwh: 347.5,
    installedLoadKw: 3120.0,
  },
  {
    department: "Air Compressor",
    // mcs: 1,
    consumedUnitKwh: 71.0,
    installedLoadKw: 1320.0,
  },
  {
    department: "Deep Well Turbine",
    mcs: 3,
    consumedUnitKwh: 119.0,
    installedLoadKw: 2640.0,
  },
  {
    department: "Bailing Press",
    mcs: 1,
    consumedUnitKwh: 22.0,
    installedLoadKw: 228.0,
  },
  {
    department: "Mills Lightning",
    mcs: 1,
    consumedUnitKwh: 15.0,
    installedLoadKw: 144.0,
  },
  {
    department: "Residential Colony",
    mcs: 1,
    consumedUnitKwh: 60.0,
    installedLoadKw: 456.0,
  },
  {
    department: "Conditioning Machine",
    mcs: 0,
    consumedUnitKwh: 30.0,
    // installedLoadKw: 0,
  },
  {
    department: "Conditioning Machine",
    mcs: 1,
    consumedUnitKwh: 72.0,
    installedLoadKw: 600.0,
  },
];

const SingleUnitComponent = ({ unit, startDate, endDate, spindles }) => {
  const totalInstalledLoad = tableData.reduce((sum, row) => {
    const value = parseFloat(row.installedLoadKw);
    return sum + (isNaN(value) ? 0 : value);
  }, 0);
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
          <button className="bg-[#1A68B2] text-white py-1 px-5 rounded text-[14.22px] font-500 font-inter">
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
        <div className="overflow-x-scroll  md:w-full md:overflow-x-hidden max-h-[29vh] overflow-y-auto">
          <table className="table w-full border-collapse border border-gray-300 dark:border-gray-500">
            <thead className="sticky top-0 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] w-full  z-10">
              <tr className="border border-gray-300 dark:border-gray-500">
                <th className="border border-gray-300 dark:border-gray-500 w-[30%] px-2 py-1 text-[12px] font-inter font-500">
                  Department
                </th>
                <th className="border border-gray-300 dark:border-gray-500 w-[20%] px-2 py-1 text-[12px] font-inter font-500">
                  Mcs
                </th>
                <th className="border border-gray-300 dark:border-gray-500 w-[20%] px-2 py-1 text-[12px] font-inter font-500">
                  Consumed units Kwh
                </th>
                <th className="border border-gray-300 dark:border-gray-500 w-[30%] px-2 py-1 text-[12px] font-inter font-500">
                  Installed Load Kw
                </th>
              </tr>
            </thead>
          </table>
          <div className="">
            <table className="table w-full border-collapse border border-gray-400">
              <tbody>
                {tableData.map((item, index) => (
                  <tr
                    key={index}
                    className="border border-gray-300 dark:border-gray-500 text-[12px] font-inter font-400"
                  >
                    <td className="px-2 py-1 border border-gray-300 dark:border-gray-500  md:w-[30%] text-[12px] font-inter font-400">
                      {item.department}
                    </td>
                    <td className="px-2 py-1 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] border border-gray-300 text-[12px] font-inter font-400 dark:border-gray-500 w-[20%] text-center">
                      {item.mcs}
                    </td>
                    <td className="px-2 py-1 bg-[#E5F3FD] dark:bg-[#e5f3fd4f] border border-gray-300 text-[12px] font-inter font-400 dark:border-gray-500 w-[20%] text-center">
                      {item.consumedUnitKwh}
                    </td>
                    <td className="px-2 py-1 text-center border border-gray-300 dark:border-gray-500 w-[30%] text-[12px] font-inter font-400">
                      {item.installedLoadKw}
                    </td>
                  </tr>
                ))}
                <tr className="border border-gray-300 dark:border-gray-500">
                  <td className="px-2 py-1 border border-gray-300 dark:border-gray-500 w-[30%] text-[12px] font-inter font-500">
                    Total Load
                  </td>
                  <td></td>
                  <td></td>
                  <td className="px-2 py-1 text-center text-[12px] font-inter font-500">
                    {totalInstalledLoad}
                  </td>
                </tr>
                <tr className="border border-gray-300 dark:border-gray-500">
                  <td className="border px-2 py-1 border-gray-300 dark:border-gray-500 w-[30%] text-[12px] font-inter font-500">
                    No. of Spindles
                  </td>
                  <td></td>
                  <td></td>
                  <td className="text-center px-2 py-1 text-[12px] font-inter font-500">
                    {spindles}
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

export default SingleUnitComponent;
