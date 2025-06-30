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

const ProductionBlocks = () => {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [productionData, setProductionData] = useState([]);
  const [daysInMonth, setDaysInMonth] = useState([]);

  useEffect(() => {
    const fetchedData = [
      { date: "1/7/2025", value: "150kg" },
      { date: "3/7/2025", value: "200kg" },
      { date: "5/7/2025", value: "180kg" },
      { date: "10/7/2025", value: "210kg" },
      { date: "15/7/2025", value: "220kg" },
    ];
    setProductionData(fetchedData);
  }, []);

  const generateDaysOfMonth = (year, month) => {
    const days = new Date(year, month + 1).getDate();
    const datesArray = [];
    for (let i = 1; i <= days; i++) {
      const dayStr = i.toString();
      const monthStr = (month + 1).toString();
      datesArray.push(`${dayStr}/${monthStr}/${year}`);
    }
    setDaysInMonth(datesArray);
  };
  const productionByDate = (dateStr) => {
    const entry = productionData.find((d) => d.date === dateStr);
    return entry ? entry.value : "-";
  };
  // console.log(productionByDate("1/7/2025"));

  useEffect(() => {
    generateDaysOfMonth(year, month);
  }, [month, year]);
  return (
    <div>
      <h1>production spindles</h1>
    </div>
  );
};
export default ProductionBlocks;
