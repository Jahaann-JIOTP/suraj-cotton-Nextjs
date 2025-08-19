"use client";

import React from "react";
const DataVerificationPanelEmptyPage = () => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 sm:px-8 py-8 min-h-[70vh] h-full w-full">
     
      <img src="../../../no-meter.png" alt="no meter image" className="mb-4 h-[120px] w-auto sm:h-[180px] md:h-[208px]" />
      <p
        className="text-[16px] text-center text-[#7B849A]"
      >
        No meter is selected !!
      </p>
    </div>
  );
};

export default DataVerificationPanelEmptyPage;
