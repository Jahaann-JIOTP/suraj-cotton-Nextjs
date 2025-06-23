import React from "react";

const SpindleProductionPage = () => {
  return (
    <div className="flex flex-col bg-white dark:bg-gray-800 w-full h-full rounded-md border-t-3 border-[#1F5897] px-4 py-2">
      <h1 className="font-raleway text-[18.22px] text-black dark:text-white font-600">
        Spindle Production
      </h1>
      <div className="w-full flex items-center justify-center">
        <div className="w-full md:w-[80%] lg:w-[50%] flex flex-col items-center justify-center">
          <form>
            <div className="w-full flex flex-col items-center mt-10 justify-center">
              <h3 className="font-inter text-[16px] pt-5 text-black dark:text-white font-500">
                Select Plant Units
              </h3>

              <div className="flex gap-15">
                <label
                  htmlFor="unit4"
                  className="font-inter text-[15px] pt-5 text-black dark:text-white font-500 flex items-center justify-center gap-2"
                >
                  <input type="radio" id="unit4" name="unit" value="unit4" />
                  Unit 4
                </label>
                <label
                  htmlFor="unit5"
                  className="font-inter text-[15px] pt-5 text-black dark:text-white font-500 flex items-center justify-center gap-2"
                >
                  <input type="radio" id="unit5" name="unit" value="unit5" />
                  Unit 5
                </label>
              </div>
              <div className="flex flex-col items-center justify-center">
                <label
                  htmlFor="selectDate"
                  className="font-inter text-[15px] pt-5 text-black dark:text-white font-500"
                >
                  Select Date
                </label>
                <input
                  type="date"
                  id="selectDate"
                  name="selectDate"
                  className="outline-none border-1 border-gray-300 dark:border-y-gray-500 rouded px-2 py-1.5 w-[12rem] rounded-sm"
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
    </div>
  );
};

export default SpindleProductionPage;
