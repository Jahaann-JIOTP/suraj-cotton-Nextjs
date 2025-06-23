"use client";
import React, { useState } from "react";

const ProductionDatadummy = [
  {
    id: 0,
    plan: "unit4",
    date: "06/23/2025",
    production: "1200",
  },
];

const SpindleProductionPage = () => {
  const [prductionData, setPrductionData] = useState({
    id: 1,
    unit: "",
    selectDate: "",
    production: "",
  });

  console.log("Form Data:", ProductionDatadummy);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPrductionData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    ProductionDatadummy.push(prductionData);
    // Now formData.unit, formData.selectDate, and formData.production are available

    setPrductionData((prev) => ({
      id: prev.id + 1, // Auto-increment ID
      unit: "",
      selectDate: "",
      production: "",
    }));
  };

  return (
    <div className="flex flex-col bg-white dark:bg-gray-800 w-full h-full rounded-md border-t-3 border-[#1F5897] px-4 py-2">
      <h1 className="font-raleway text-[18.22px] text-black dark:text-white font-600">
        Spindle Production
      </h1>
      <div className="w-full flex items-center justify-center">
        <div className="w-full md:w-[80%] lg:w-[50%] flex flex-col items-center justify-center">
          <form onSubmit={handleSubmit}>
            <div className="w-full flex flex-col items-center mt-10 justify-center">
              <h3 className="font-inter text-[16px] pt-5 text-black dark:text-white font-500">
                Select Plant Units
              </h3>

              <div className="flex gap-15">
                <label
                  htmlFor="unit4"
                  className="font-inter text-[15px] pt-5 text-black dark:text-white font-500 flex items-center justify-center gap-2"
                >
                  <input
                    type="radio"
                    id="unit4"
                    onChange={handleChange}
                    name="unit"
                    value="unit 4"
                  />
                  Unit 4
                </label>
                <label
                  htmlFor="unit5"
                  className="font-inter text-[15px] pt-5 text-black dark:text-white font-500 flex items-center justify-center gap-2"
                >
                  <input
                    type="radio"
                    id="unit5"
                    name="unit"
                    onChange={handleChange}
                    value="unit 5"
                  />
                  Unit 5
                </label>
              </div>
              <div className="flex flex-col items-center justify-center">
                <label
                  htmlFor="selectDate"
                  className="font-inter text-[15px] pt-5 text-black  dark:text-white font-500"
                >
                  Select Date
                </label>
                <input
                  type="date"
                  id="selectDate"
                  name="selectDate"
                  className="outline-none border-1 border-gray-300 dark:border-y-gray-500 rouded px-2 py-1.5 w-[12rem] rounded-sm"
                  onChange={handleChange}
                  value={prductionData.selectDate}
                />
              </div>
              <div className="flex flex-col items-center justify-center">
                <label
                  htmlFor="production"
                  className="font-inter text-[15px] pt-5 text-black dark:text-white font-500"
                >
                  Enter Production
                </label>
                <input
                  type="number"
                  id="production"
                  name="production"
                  onChange={handleChange}
                  value={prductionData.production}
                  className="outline-none border-1 border-gray-300 dark:border-y-gray-500 rouded px-2 py-1.5 w-[12rem] rounded-sm"
                />
              </div>
              <button
                type="submit"
                className="bg-[#1F5897] text-white w-[6rem] py-1.5 rounded mt-4"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="relative border-2 rounded border-blue-900">
        <div className="w-full flex items-center justify-center">
          <h2
            className="text-white bg-blue-900 px-10 py-1.5"
            style={{
              clipPath: "polygon(10% 0, 90% 0, 100% 100%, 0 100%)",
            }}
          >
            History of daily production
          </h2>
        </div>
        <div className="absolute top-2 left-2">
          <label htmlFor="month">Month</label>
          <select
            name="month"
            id="month"
            className="dark:bg-gray-800 rounded shadow text-black dark:text-white p-1 outline-none ml-2 "
            style={{ appearance: "none" }}
          >
            <option value="june">June</option>
            <option value="may">May</option>
            <option value="april">April</option>
            <option value="march">March</option>
            <option value="february">February</option>
            <option value="january">January</option>
            <option value="december">December</option>
            <option value="november">November</option>
            <option value="october">October</option>
          </select>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default SpindleProductionPage;
