"use client";
import React from "react";
import { useRouter } from "next/navigation";

const Unit4Lt1 = ({ setIsLT1 }) => {
  const router = useRouter();
  console.log("this is reouter", router);
  return (
    <div className="w-full overflow-auto">
      <button
        onClick={() => setIsLT1(false)}
        className="absolute z-20 top-0 left-0 bg-gray-300 px-5 py-1 rounded"
      >
        Back
      </button>
      <button
        onClick={router.push("/sld?meter-1")}
        on
        className="bg-[#da121270] w-[20px] absolute h-[20px]"
      >
        click me
      </button>
      <div className="relative w-[1200px] h-full mx-auto">
        {/* Diagram Image */}
        <img
          src="../../../unit-4-lt-01.png"
          className="w-[1200px] h-full"
          alt="unit 4 sld"
        />

        {/* Buttons */}

        {/* Meter Readings */}

        {/* ///////////////////////// */}
        <div className="meterReadingUnit4Lt1 absolute top-[324px] left-[210px]">
          1228
        </div>
        <div className="meterReadingUnit4Lt1 absolute top-[341px] left-[210px]">
          1398
        </div>
        <div className="meterReadingUnit4Lt1 absolute top-[359px] left-[210px]">
          1572
        </div>
        {/* ///////////////////////// */}
        <div className="meterReadingUnit4Lt1 absolute top-[324px] left-[399.5px]">
          1228
        </div>
        <div className="meterReadingUnit4Lt1 absolute top-[341px] left-[399.5px]">
          1398
        </div>
        <div className="meterReadingUnit4Lt1 absolute top-[359px] left-[399.5px]">
          1572
        </div>
        {/* ///////////////////////// */}
        <div className="meterReadingUnit4Lt1 absolute top-[324px] left-[589px]">
          1228
        </div>
        <div className="meterReadingUnit4Lt1 absolute top-[341px] left-[589px]">
          1398
        </div>
        <div className="meterReadingUnit4Lt1 absolute top-[359px] left-[589px]">
          1572
        </div>

        {/* /////////////////////*/}
        <div className="meterReadingUnit4Lt1 absolute top-[324px] left-[777px]">
          1228
        </div>
        <div className="meterReadingUnit4Lt1 absolute top-[341px] left-[777px]">
          1398
        </div>
        <div className="meterReadingUnit4Lt1 absolute top-[359px] left-[777px]">
          1572
        </div>

        {/* /////////////////////////// */}
        <div className="meterReadingUnit4Lt1 absolute top-[400.5px] left-[306px]">
          1228
        </div>
        <div className="meterReadingUnit4Lt1 absolute top-[417.5px] left-[306px]">
          1398
        </div>
        <div className="meterReadingUnit4Lt1 absolute top-[436px] left-[306px]">
          1572
        </div>
        {/* /////////////////////////// */}
        <div className="meterReadingUnit4Lt1 absolute top-[400.5px] left-[495.5px]">
          1228
        </div>
        <div className="meterReadingUnit4Lt1 absolute top-[417.5px] left-[495.5px]">
          1398
        </div>
        <div className="meterReadingUnit4Lt1 absolute top-[436px] left-[495.5px]">
          1572
        </div>
        {/* /////////////////////////// */}
        <div className="meterReadingUnit4Lt1 absolute top-[400.5] left-[684.5px]">
          1228
        </div>
        <div className="meterReadingUnit4Lt1 absolute top-[417.5px] left-[684.5px]">
          1398
        </div>
        <div className="meterReadingUnit4Lt1 absolute top-[436px] left-[684.5px]">
          1572
        </div>
        {/* /////////////////////////// */}
        <div className="meterReadingUnit4Lt1 absolute top-[402] left-[881px]">
          1228
        </div>
        <div className="meterReadingUnit4Lt1 absolute top-[418.5px] left-[881px]">
          1398
        </div>
        <div className="meterReadingUnit4Lt1 absolute top-[436.7px] left-[881px]">
          1572
        </div>
        {/* /////////////////////////// */}
        <div className="meterReadingUnit4Lt1 absolute top-[608px] left-[309.5px]">
          1228
        </div>
        <div className="meterReadingUnit4Lt1 absolute top-[626px] left-[309.5px]">
          1398
        </div>
        <div className="meterReadingUnit4Lt1 absolute top-[643.5px] left-[309.5px]">
          1572
        </div>
        {/* /////////////////////////// */}
        <div className="meterReadingUnit4Lt1 absolute top-[608.45px] left-[500.5px]">
          1228
        </div>
        <div className="meterReadingUnit4Lt1 absolute top-[626px] left-[500.5px]">
          1398
        </div>
        <div className="meterReadingUnit4Lt1 absolute top-[644px] left-[500.5px]">
          1572
        </div>
        {/* /////////////////////////// */}
        <div className="meterReadingUnit4Lt1 absolute top-[608.45px] left-[689.5px]">
          1228
        </div>
        <div className="meterReadingUnit4Lt1 absolute top-[626px] left-[689.5px]">
          1398
        </div>
        <div className="meterReadingUnit4Lt1 absolute top-[644px] left-[689.5px]">
          1572
        </div>
        {/* /////////////////////////// */}
        <div className="meterReadingUnit4Lt1 absolute top-[608.45px] left-[879px]">
          1228
        </div>
        <div className="meterReadingUnit4Lt1 absolute top-[626px] left-[879px]">
          1398
        </div>
        <div className="meterReadingUnit4Lt1 absolute top-[644px] left-[879px]">
          1572
        </div>
        {/* /////////////////////////// */}
        <div className="meterReadingUnit4Lt1 absolute top-[684.5] left-[404px]">
          1228
        </div>
        <div className="meterReadingUnit4Lt1 absolute top-[702px] left-[404px]">
          1398
        </div>
        <div className="meterReadingUnit4Lt1 absolute top-[720px] left-[404px]">
          1572
        </div>
        {/* /////////////////////////// */}
        <div className="meterReadingUnit4Lt1 absolute top-[684.5px] left-[594px]">
          1228
        </div>
        <div className="meterReadingUnit4Lt1 absolute top-[702px] left-[594px]">
          1398
        </div>
        <div className="meterReadingUnit4Lt1 absolute top-[720px] left-[594px]">
          1572
        </div>
        {/* /////////////////////////// */}
        <div className="meterReadingUnit4Lt1 absolute top-[684.5px] left-[783px]">
          1228
        </div>
        <div className="meterReadingUnit4Lt1 absolute top-[702px] left-[783px]">
          1398
        </div>
        <div className="meterReadingUnit4Lt1 absolute top-[720px] left-[783px]">
          1572
        </div>
      </div>
    </div>
  );
};

export default Unit4Lt1;
