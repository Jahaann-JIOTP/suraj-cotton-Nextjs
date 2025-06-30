"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import config from "@/constant/apiRouteList";

const page = () => {
  // const [activeTab, setActiveTab] = useState("voltage");
  const [activeTab, setActiveTab] = useState("voltage");
  const [data, setData] = useState([]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const area = searchParams.get("area");
  const ltScheme = searchParams.get("lt_scheme");
  const id = searchParams.get("meter_id");
  const meterName = searchParams.get("meter_name");

  const getSingleMeterData = async () => {
    try {
      const response = await fetch(
        `${config.SURAJ_COTTON_BASE_URL}/meter-data`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            area,
            LT_selections: ltScheme,
            meterId: id,
          }),
        }
      );
      if (response.ok) {
        const resResult = await response.json();
        setData(resResult.data);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  // get prefixes of keys
  const suffixTags = {};
  const prefix = `${id}_`;

  for (const key in data) {
    if (key.startsWith(prefix)) {
      const newKey = key.slice(prefix.length);
      suffixTags[newKey] = Math.round(data[key] * 100) / 100;
    } else {
      suffixTags[key] = Math.round(data[key] * 100) / 100;
    }
  }
  console.log(suffixTags);
  useEffect(() => {
    getSingleMeterData();
    const interval = setInterval(() => {
      getSingleMeterData();
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="w-full bg-white p-5 rounded-md border-t-3 border-[#1F5897] overflow-auto">
      <div className="relative w-[1400px] flex items-start  flex-col h-full mx-auto">
        <h1 className="font-semibold text-2xl font-inter pb-4 text-black dark:text-white">
          {meterName}
        </h1>
        {activeTab === "voltage" ? (
          <img src="../../01_volts.png" alt="" className="w-[1295px]" />
        ) : activeTab === "power" ? (
          <img src="../../Power_1.png" alt="" className="w-[1295px]" />
        ) : activeTab === "energy" ? (
          <img src="../../Energy_log1.png" alt="" className="w-[1295px]" />
        ) : (
          ""
        )}
        <button
          onClick={() => setActiveTab("voltage")}
          className="w-[230px] h-[34px] bg-transparent absolute z-30 top-[49px] left-[3px] cursor-pointer"
        ></button>
        <button
          onClick={() => setActiveTab("power")}
          className="w-[230px] h-[34px] bg-transparent absolute z-30 top-[49px] left-[249px] cursor-pointer"
        ></button>
        <button
          onClick={() => setActiveTab("energy")}
          className="w-[230px] h-[34px] bg-transparent absolute z-30 top-[49px] left-[487px] cursor-pointer"
        ></button>
        {activeTab === "voltage" && (
          <button
            onClick={() => router.back()}
            className="absolute cursor-pointer h-[44px] w-[140px] z-30 top-[98px] left-[1150px] bg-transparent"
          ></button>
        )}

        {/* values */}
        {activeTab === "voltage" ? (
          <>
            <div className="absolute meterDataText top-[261px] left-[49px]">
              {suffixTags.Voltage_CA} V ca
            </div>
            <div className="absolute meterDataText top-[204px] left-[196px]">
              {suffixTags.Voltage_BC} V bc
            </div>
            <div className="absolute meterDataText top-[306px] left-[197px]">
              {suffixTags.Voltage_AB} V ab
            </div>
            <div className="absolute meterDataText top-[134.5px] left-[353px]">
              {suffixTags.Current_C} A c
            </div>
            <div className="absolute meterDataText top-[255px] left-[353px]">
              {suffixTags.Current_B} A b
            </div>
            <div className="absolute meterDataText top-[367px] left-[353px]">
              {suffixTags.Current_A} A a
            </div>
            <div className="absolute meterDataText top-[571px] left-[195px]">
              {suffixTags.Voltage_Avg} V
            </div>
            <div className="absolute meterDataText top-[509px] left-[355px]">
              {suffixTags.Current_Avg} A
            </div>
            <div className="absolute meterDataText top-[135px] left-[562px]">
              N/A
            </div>
            <div className="absolute meterDataText top-[255px] left-[562px]">
              N/A
            </div>
            <div className="absolute meterDataText top-[368px] left-[562px]">
              N/A
            </div>
            <div className="absolute meterDataText top-[440px] left-[540px]">
              {suffixTags.ActivePower_Total} kW
            </div>
            <div className="absolute meterDataText top-[510px] left-[540px]">
              {suffixTags.ReactivePower_Total} kVAR
            </div>
            <div className="absolute meterDataText top-[570px] left-[540px]">
              {suffixTags.ApparentPower_Total} kVA
            </div>
            <div className="absolute meterDataText top-[489px] left-[713px]">
              {suffixTags.Voltage_AN} V an
            </div>
            <div className="absolute meterDataText top-[489px] left-[855px]">
              {suffixTags.Voltage_BN} V bn
            </div>
            <div className="absolute meterDataText top-[489px] left-[1003px]">
              {suffixTags.Voltage_CN} V cn
            </div>
            <div className="absolute meterDataText top-[215px] left-[1195px]">
              N/A
            </div>
            <div className="absolute meterDataText top-[280px] left-[1195px]">
              {suffixTags.PowerFactor_Avg}
            </div>
            <div className="absolute meterDataText top-[340px] left-[1195px]">
              N/A
            </div>
            <div className="absolute meterDataText top-[400px] left-[1195px]">
              N/A
            </div>
            <div className="absolute meterDataText top-[464px] left-[1195px]">
              N/A
            </div>
            <div className="absolute meterDataText top-[526px] left-[1180px]">
              {suffixTags.Voltage_LN_Avg} V
            </div>
          </>
        ) : activeTab === "power" ? (
          <>
            <div className="absolute meterDataText top-[305px] left-[170px]">
              N/A
            </div>
            <div className="absolute meterDataText top-[388px] left-[170px]">
              N/A
            </div>
            <div className="absolute meterDataText top-[468px] left-[170px]">
              N/A
            </div>
            <div className="absolute meterDataText top-[305px] left-[530px]">
              N/A
            </div>
            <div className="absolute meterDataText top-[388px] left-[530px]">
              N/A
            </div>
            <div className="absolute meterDataText top-[468px] left-[530px]">
              N/A
            </div>
            <div className="absolute meterDataText top-[306px] left-[855px]">
              N/A
            </div>
            <div className="absolute meterDataText top-[389px] left-[855px]">
              N/A
            </div>
            <div className="absolute meterDataText top-[471px] left-[855px]">
              N/A
            </div>
            <div className="absolute meterDataText top-[305px] left-[1015px]">
              N/A
            </div>
            <div className="absolute meterDataText top-[390px] left-[1015px]">
              N/A
            </div>
            <div className="absolute meterDataText top-[470px] left-[1015px]">
              N/A
            </div>
            <div className="absolute meterDataText top-[305px] left-[1175px]">
              N/A
            </div>
            <div className="absolute meterDataText top-[390px] left-[1175px]">
              N/A
            </div>
            <div className="absolute meterDataText top-[470px] left-[1175px]">
              N/A
            </div>

            <div className="absolute meterDataText top-[558px] left-[855px]">
              {suffixTags.ApparentPower_Total}
            </div>
            <div className="absolute meterDataText top-[558px] left-[1015px]">
              {suffixTags.ActivePower_Total}
            </div>
            <div className="absolute meterDataText top-[557px] left-[1175px]">
              {suffixTags.ReactivePower_Total}
            </div>
          </>
        ) : activeTab === "energy" ? (
          <>
            <div className="absolute meterDataText top-[232px] left-[390px]">
              N/A
            </div>
            <div className="absolute meterDataText top-[320px] left-[390px]">
              N/A
            </div>
            <div className="absolute meterDataText top-[408px] left-[390px]">
              N/A
            </div>
            <div className="absolute meterDataText top-[230px] left-[630px]">
              N/A
            </div>
            <div className="absolute meterDataText top-[320px] left-[630px]">
              N/A
            </div>
            <div className="absolute meterDataText top-[410px] left-[630px]">
              N/A
            </div>
            <div className="absolute meterDataText top-[230px] left-[870px]">
              N/A
            </div>
            <div className="absolute meterDataText top-[320px] left-[870px]">
              N/A
            </div>
            <div className="absolute meterDataText top-[410px] left-[870px]">
              N/A
            </div>
            <div className="absolute meterDataText top-[493px] left-[390px]">
              {suffixTags.ApparentPower_Total}
            </div>
            <div className="absolute meterDataText top-[493px] left-[630px]">
              {suffixTags.ActivePower_Total}
            </div>
            <div className="absolute meterDataText top-[493px] left-[870px]">
              {suffixTags.ReactivePower_Total}
            </div>
          </>
        ) : (
          ""
        )}
        {/* values */}

        {/* logs opener */}
        <button
          onClick={() =>
            router.push(
              `/logs?type=${activeTab}&lt_scheme=${ltScheme}&val=${activeTab}&meter_id=${id}`
            )
          }
          className={`bg-transparent w-[57px] h-[53px] absolute z-30 cursor-pointer`}
          style={{
            top:
              activeTab === "voltage"
                ? "516px"
                : activeTab === "power"
                ? "577px"
                : activeTab === "energy"
                ? "572px"
                : "",
            left:
              activeTab === "voltage"
                ? "36px"
                : activeTab === "power"
                ? "42px"
                : activeTab === "energy"
                ? "37.5px"
                : "",
          }}
        ></button>
      </div>
    </div>
  );
};

export default page;
