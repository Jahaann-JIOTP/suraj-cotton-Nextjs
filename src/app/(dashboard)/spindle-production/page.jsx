// "use client";
// import React, { useState } from "react";

// const ProductionDatadummy = [
//   {
//     id: 0,
//     plan: "unit4",
//     date: "06/23/2025",
//     production: "1200",
//   },
// ];

// const chunkArray = (arr, chunkSize) => {
//   const result = [];
//   for (let i = 0; i < arr.length; i += chunkSize) {
//     result.push(arr.slice(i, i + chunkSize));
//   }
//   return result;
// };

// const SpindleProductionPage = () => {
//   const [prductionData, setPrductionData] = useState({
//     id: 1,
//     unit: "",
//     selectDate: "",
//     production: "",
//   });

//   // console.log("Form Data:", ProductionDatadummy);
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setPrductionData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     ProductionDatadummy.push(prductionData);
//     // Now formData.unit, formData.selectDate, and formData.production are available

//     setPrductionData((prev) => ({
//       id: prev.id + 1, // Auto-increment ID
//       unit: "",
//       selectDate: "",
//       production: "",
//     }));
//   };
//   const chunks = chunkArray(prductionData, 15);

//   return (
//     <div className="flex flex-col bg-white dark:bg-gray-800 w-full h-full rounded-md border-t-3 border-[#1F5897] px-4 py-2">
//       <h1 className="font-raleway text-[18.22px] text-black dark:text-white font-600">
//         Spindle Production
//       </h1>
//       <div className="w-full flex items-center justify-center">
//         <div className="w-full md:w-[80%] lg:w-[50%] flex flex-col items-center justify-center">
//           <form onSubmit={handleSubmit}>
//             <div className="w-full flex flex-col items-center mt-10 justify-center">
//               <h3 className="font-inter text-[16px] pt-5 text-black dark:text-white font-500">
//                 Select Plant Units
//               </h3>

//               <div className="flex gap-15">
//                 <label
//                   htmlFor="unit4"
//                   className="font-inter text-[15px] pt-5 text-black dark:text-white font-500 flex items-center justify-center gap-2"
//                 >
//                   <input
//                     type="radio"
//                     id="unit4"
//                     onChange={handleChange}
//                     name="unit"
//                     value="unit 4"
//                   />
//                   Unit 4
//                 </label>
//                 <label
//                   htmlFor="unit5"
//                   className="font-inter text-[15px] pt-5 text-black dark:text-white font-500 flex items-center justify-center gap-2"
//                 >
//                   <input
//                     type="radio"
//                     id="unit5"
//                     name="unit"
//                     onChange={handleChange}
//                     value="unit 5"
//                   />
//                   Unit 5
//                 </label>
//               </div>
//               <div className="flex flex-col items-center justify-center">
//                 <label
//                   htmlFor="selectDate"
//                   className="font-inter text-[15px] pt-5 text-black  dark:text-white font-500"
//                 >
//                   Select Date
//                 </label>
//                 <input
//                   type="date"
//                   id="selectDate"
//                   name="selectDate"
//                   className="outline-none border-1 border-gray-300 dark:border-y-gray-500 rouded px-2 py-1.5 w-[12rem] rounded-sm"
//                   onChange={handleChange}
//                   value={prductionData.selectDate}
//                 />
//               </div>
//               <div className="flex flex-col items-center justify-center">
//                 <label
//                   htmlFor="production"
//                   className="font-inter text-[15px] pt-5 text-black dark:text-white font-500"
//                 >
//                   Enter Production
//                 </label>
//                 <input
//                   type="number"
//                   id="production"
//                   name="production"
//                   onChange={handleChange}
//                   value={prductionData.production}
//                   className="outline-none border-1 border-gray-300 dark:border-y-gray-500 rouded px-2 py-1.5 w-[12rem] rounded-sm"
//                 />
//               </div>
//               <button
//                 type="submit"
//                 className="bg-[#1F5897] text-white w-[6rem] py-1.5 rounded mt-4"
//               >
//                 Submit
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//       <div className="relative border-2 rounded border-blue-900">
//         <div className="w-full flex items-center justify-center">
//           <h2
//             className="text-white bg-blue-900 px-10 py-1.5 text-[17.62px] font-inter font-500"
//             style={{
//               clipPath: "polygon(10% 0, 90% 0, 100% 100%, 0 100%)",
//             }}
//           >
//             History of daily production
//           </h2>
//         </div>
//         <div className="absolute top-2 left-2">
//           <label htmlFor="month">Month</label>
//           <select
//             name="month"
//             id="month"
//             className="dark:bg-gray-800 rounded shadow text-black dark:text-white p-1 outline-none ml-2 "
//             style={{ appearance: "none" }}
//           >
//             <option value="june">June</option>
//             <option value="may">May</option>
//             <option value="april">April</option>
//             <option value="march">March</option>
//             <option value="february">February</option>
//             <option value="january">January</option>
//             <option value="december">December</option>
//             <option value="november">November</option>
//             <option value="october">October</option>
//           </select>
//         </div>
//         <div>
//           <div className="p-4">
//             <h2 className="text-xl font-bold mb-4">Chunked API Data Display</h2>

//             {chunks.map((chunk, index) => {
//               console.log("this is api chunks", chunk);
//               return (
//                 <div
//                   key={index}
//                   className="w-full border border-gray-400 rounded mb-6 p-4 h-[250px] overflow-y-auto"
//                 >
//                   <h3 className="text-lg font-semibold mb-2">
//                     Block {index + 1}
//                   </h3>
//                   {chunk.map((item) => (
//                     <div key={item.id} className="text-black dark:text-white">
//                       {item.id}. {item.name}
//                     </div>
//                   ))}
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SpindleProductionPage;
"use client";

import React, { useEffect, useState } from "react";

// Helper function to chunk array into groups of 15
const chunkArray = (arr, chunkSize) => {
  const result = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    result.push(arr.slice(i, i + chunkSize));
  }
  return result;
};

const ProductionBlocks = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulate API call (replace with your real API URL)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate fetch with local mock data
        const apiData = [
          { id: 0, plan: "unit4", date: "06/23/2025", production: "1200" },
          { id: 0, plan: "unit4", date: "06/23/2025", production: "1200" },
          { id: 0, plan: "unit4", date: "06/23/2025", production: "1200" },
          { id: 0, plan: "unit4", date: "06/23/2025", production: "1200" },
          { id: 0, plan: "unit4", date: "06/23/2025", production: "1200" },
          { id: 0, plan: "unit4", date: "06/23/2025", production: "1200" },
          { id: 0, plan: "unit4", date: "06/23/2025", production: "1200" },
          { id: 0, plan: "unit4", date: "06/23/2025", production: "1200" },
          { id: 0, plan: "unit4", date: "06/23/2025", production: "1200" },
          { id: 0, plan: "unit4", date: "06/23/2025", production: "1200" },
          { id: 0, plan: "unit4", date: "06/23/2025", production: "1200" },
          { id: 0, plan: "unit4", date: "06/23/2025", production: "1200" },
          { id: 0, plan: "unit4", date: "06/23/2025", production: "1200" },
          { id: 0, plan: "unit4", date: "06/23/2025", production: "1200" },
          { id: 0, plan: "unit4", date: "06/23/2025", production: "1200" },
          { id: 0, plan: "unit4", date: "06/23/2025", production: "1200" },
          { id: 0, plan: "unit4", date: "06/23/2025", production: "1200" },
          { id: 0, plan: "unit4", date: "06/23/2025", production: "1200" },
          { id: 0, plan: "unit4", date: "06/23/2025", production: "1200" },
          { id: 0, plan: "unit4", date: "06/23/2025", production: "1200" },
          { id: 0, plan: "unit4", date: "06/23/2025", production: "1200" },
          { id: 0, plan: "unit4", date: "06/23/2025", production: "1200" },
          { id: 0, plan: "unit4", date: "06/23/2025", production: "1200" },
          { id: 0, plan: "unit4", date: "06/23/2025", production: "1200" },
          { id: 0, plan: "unit4", date: "06/23/2025", production: "1200" },
          { id: 0, plan: "unit4", date: "06/23/2025", production: "1200" },
          { id: 0, plan: "unit4", date: "06/23/2025", production: "1200" },
          { id: 0, plan: "unit4", date: "06/23/2025", production: "1200" },
          { id: 0, plan: "unit4", date: "06/23/2025", production: "1200" },
          { id: 0, plan: "unit4", date: "06/23/2025", production: "1200" },
          { id: 0, plan: "unit4", date: "06/23/2025", production: "1200" },
          { id: 0, plan: "unit4", date: "06/23/2025", production: "1200" },
          // 👉 add more items here to test multiple blocks (e.g., 20–30)
        ];
        setData(apiData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const blocks = chunkArray(data, 15);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Production Report</h2>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : blocks.length === 0 ? (
        <p className="text-gray-500">No data available.</p>
      ) : (
        blocks.map((block, index) => (
          <div
            key={index}
            className="w-full border border-gray-400 rounded mb-6 p-4 h-[250px] overflow-y-auto"
          >
            <h3 className="text-lg font-semibold mb-2">Block {index + 1}</h3>
            {/* <table className="w-full text-left border-collapse"> */}
            <div>
              <table>
                <tbody>
                  <th>Date</th>
                  {block.map((item, index) => {
                    return (
                      <td key={index} className="border-r-2 border-green-300">
                        {item.date}
                      </td>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ProductionBlocks;
