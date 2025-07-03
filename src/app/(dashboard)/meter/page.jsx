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
    const value = data[key];
    const isNumber = typeof value === "number";
    const roundedValue =
      isNumber && Math.abs(value) > 1e9
        ? 0
        : isNumber
        ? Math.round(value * 100) / 100
        : value;

    if (key.startsWith(prefix)) {
      const newKey = key.slice(prefix.length);
      suffixTags[newKey] = roundedValue;
    } else {
      suffixTags[key] = roundedValue;
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
    <div className="w-full bg-white p-5 rounded-md border-t-3 h-[81vh] border-[#1F5897] overflow-auto">
      <div className="relative w-[1300px] flex items-start  flex-col h-full mx-auto">
        <h1 className="font-semibold text-2xl font-inter pb-4 text-black">
          {meterName}
        </h1>
        {activeTab === "voltage" ? (
          <img src="../../01_volts.png" alt="" className="w-[1290px]" />
        ) : activeTab === "power" ? (
          <img src="../../Power_1.png" alt="" className="w-[1290px]" />
        ) : activeTab === "energy" ? (
          <img src="../../Energy_log1.png" alt="" className="w-[1290px]" />
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
              {suffixTags.Voltage_CA || "00.00"} V ca
            </div>
            <div className="absolute meterDataText top-[204px] left-[196px]">
              {suffixTags.Voltage_BC || "00.00"} V bc
            </div>
            <div className="absolute meterDataText top-[306px] left-[197px]">
              {suffixTags.Voltage_AB || "00.00"} V ab
            </div>
            <div className="absolute meterDataText top-[134.5px] left-[353px]">
              {suffixTags.Current_C || "00.00"} A c
            </div>
            <div className="absolute meterDataText top-[255px] left-[353px]">
              {suffixTags.Current_B || "00.00"} A b
            </div>
            <div className="absolute meterDataText top-[367px] left-[353px]">
              {suffixTags.Current_A || "00.00"} A a
            </div>
            <div className="absolute meterDataText top-[571px] left-[195px]">
              {suffixTags.Voltage_Avg || "00.00"} V
            </div>
            <div className="absolute meterDataText top-[509px] left-[355px]">
              {suffixTags.Current_Avg || "00.00"} A
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
              {suffixTags.ActivePower_Total || "00.00"} kW
            </div>
            <div className="absolute meterDataText top-[510px] left-[532px]">
              {suffixTags.ReactivePower_Total || "00.00"} kVAR
            </div>
            <div className="absolute meterDataText top-[570px] left-[540px]">
              {suffixTags.ApparentPower_Total || "00.00"} kVA
            </div>
            <div className="absolute meterDataText top-[490px] left-[713px]">
              {suffixTags.Voltage_AN || "00.00"} V an
            </div>
            <div className="absolute meterDataText top-[490px] left-[855px]">
              {suffixTags.Voltage_BN || "00.00"} V bn
            </div>
            <div className="absolute meterDataText top-[490px] left-[1003px]">
              {suffixTags.Voltage_CN || "00.00"} V cn
            </div>
            <div className="absolute meterDataText top-[215px] left-[1195px]">
              N/A
            </div>
            <div className="absolute meterDataText top-[280px] left-[1190px]">
              {suffixTags.PowerFactor_Avg || "00.00"}
            </div>
            <div className="absolute meterDataText top-[340px] left-[1195px]">
              {suffixTags.PowerFactor_A || "00.00"}
            </div>
            <div className="absolute meterDataText top-[402px] left-[1195px]">
              {suffixTags.PowerFactor_B || "00.00"}
            </div>
            <div className="absolute meterDataText top-[464px] left-[1195px]">
              {suffixTags.PowerFactor_C || "00.00"}
            </div>
            <div className="absolute meterDataText top-[526px] left-[1180px]">
              {suffixTags.Voltage_LN_Avg || "00.00"} V
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
            <div className="absolute meterDataText top-[305px] left-[524px]">
              {suffixTags.Harmonics_V1_THD || "00.00"}
            </div>
            <div className="absolute meterDataText top-[388px] left-[524px]">
              {suffixTags.Harmonics_V2_THD || "00.00"}
            </div>
            <div className="absolute meterDataText top-[468px] left-[524px]">
              {suffixTags.Harmonics_V3_THD || "00.00"}
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
              {suffixTags.ActivePower_Total || "00.00"}
            </div>
            <div className="absolute meterDataText top-[558px] left-[1015px]">
              {suffixTags.ReactivePower_Total || "00.00"}
            </div>
            <div className="absolute meterDataText top-[557px] left-[1175px]">
              {suffixTags.ApparentPower_Total || "00.00"}
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
            <div className="absolute meterDataText top-[493px] left-[385px]">
              {suffixTags.Del_ActiveEnergy || "00.00"}
            </div>
            <div className="absolute meterDataText top-[493px] left-[625px]">
              {suffixTags.Rec_Active_Energy || "00.00"}
            </div>
            <div className="absolute meterDataText top-[493px] left-[865px]">
              N/A
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
