"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import config from "@/constant/apiRouteList";

const page = () => {
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
        `${config.BASE_URL}${config.DIAGRAM.METER_DATA}`,
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
            <div className="absolute meterDataText top-[258px] left-[37px] w-[110px] h-[31px] flex items-center justify-center">
              <span>{suffixTags.Voltage_CA || "00.00"}Vca</span>
            </div>
            <div className="absolute meterDataText top-[200px] left-[184.5px] w-[110px] h-[32px] flex items-center justify-center">
              <span>{suffixTags.Voltage_BC || "00.00"} V bc</span>
            </div>
            <div className="absolute meterDataText top-[302px] left-[184.5px] w-[110px] h-[32px] flex items-center justify-center">
              <span>{suffixTags.Voltage_AB || "00.00"} V ab</span>
            </div>
            <div className="absolute meterDataText top-[131px] left-[338px] w-[110px] h-[32px] flex items-center justify-center">
              <span>{suffixTags.Current_C || "00.00"} A c</span>
            </div>
            <div className="absolute meterDataText top-[251px] left-[338px] w-[110px] h-[32px] flex items-center justify-center">
              <span>{suffixTags.Current_B || "00.00"} A b</span>
            </div>
            <div className="absolute meterDataText top-[363px] left-[338px] w-[110px] h-[32px] flex items-center justify-center">
              <span>{suffixTags.Current_A || "00.00"} A a</span>
            </div>
            <div className="absolute meterDataText top-[566px] left-[183.5px] w-[110px] h-[32px] flex items-center justify-center">
              <span>{suffixTags.Voltage_Avg || "00.00"} V</span>
            </div>
            <div className="absolute meterDataText top-[505px] left-[338px] w-[110px] h-[32px] flex items-center justify-center">
              <span>{suffixTags.Current_Avg || "00.00"} A</span>
            </div>
            <div className="absolute meterDataText top-[132px] left-[522px] w-[110px] h-[32px] flex items-center justify-center">
              <span>N/A</span>
            </div>
            <div className="absolute meterDataText top-[252px] left-[522px] w-[110px] h-[32px] flex items-center justify-center">
              <span>N/A</span>
            </div>
            <div className="absolute meterDataText top-[364px] left-[522px] w-[110px] h-[32px] flex items-center justify-center">
              <span>N/A</span>
            </div>
            <div className="absolute meterDataText top-[435px] left-[522px] w-[110px] h-[32px] flex items-center justify-center">
              <span>{suffixTags.ActivePower_Total || "00.00"} kW</span>
            </div>
            <div className="absolute meterDataText top-[505px] left-[522px] w-[110px] h-[32px] flex items-center justify-center">
              <span>{suffixTags.ReactivePower_Total || "00.00"} kVAR</span>
            </div>
            <div className="absolute meterDataText top-[566px] left-[522px] w-[110px] h-[32px] flex items-center justify-center">
              <span>{suffixTags.ApparentPower_Total || "00.00"} kVA</span>
            </div>
            {/*  */}
            <div className="absolute meterDataText top-[485.5px] left-[699px] w-[110px] h-[32px] flex items-center justify-center">
              <span>{suffixTags.Voltage_AN || "00.00"} Van</span>
            </div>
            <div className="absolute meterDataText top-[485.5px] left-[840px] w-[110px] h-[32px] flex items-center justify-center">
              <span>{suffixTags.Voltage_BN || "00.00"} Vbn</span>
            </div>
            <div className="absolute meterDataText top-[485.5px] left-[989px] w-[110px] h-[32px] flex items-center justify-center">
              <span>{suffixTags.Voltage_CN || "00.00"} Vcn</span>
            </div>
            {/*  */}
            <div className="absolute meterDataText top-[212px] left-[1151.5px] w-[110px] h-[32px] flex items-center justify-center">
              <span>N/A</span>
            </div>
            <div className="absolute meterDataText top-[275px] left-[1151.5px] w-[110px] h-[32px] flex items-center justify-center">
              <span>{suffixTags.PowerFactor_Avg || "00.00"}</span>
            </div>
            <div className="absolute meterDataText top-[336px] left-[1151.5px] w-[110px] h-[32px] flex items-center justify-center">
              <span>{suffixTags.PowerFactor_A || "00.00"}</span>
            </div>
            <div className="absolute meterDataText top-[396px] left-[1151.5px] w-[110px] h-[32px] flex items-center justify-center">
              <span>{suffixTags.PowerFactor_B || "00.00"}</span>
            </div>
            <div className="absolute meterDataText top-[460px] left-[1151.5px] w-[110px] h-[32px] flex items-center justify-center">
              <span>{suffixTags.PowerFactor_C || "00.00"}</span>
            </div>
            <div className="absolute meterDataText top-[521px] left-[1151.5px] w-[110px] h-[32px] flex items-center justify-center">
              <span>{suffixTags.Voltage_LN_Avg || "00.00"}</span>
            </div>
          </>
        ) : activeTab === "power" ? (
          <>
            <div className="absolute meterDataText top-[302px] left-[138px] w-[96px] h-[30px] flex items-center justify-center">
              <span>N/A</span>
            </div>
            <div className="absolute meterDataText top-[384px] left-[138px] w-[96px] h-[30px] flex items-center justify-center">
              <span>N/A</span>
            </div>
            <div className="absolute meterDataText top-[464px] left-[138px] w-[96px] h-[30px] flex items-center justify-center">
              <span>N/A</span>
            </div>
            <div className="absolute meterDataText top-[303px] left-[492px] w-[96px] h-[29px] flex items-center justify-center">
              <span>{suffixTags.Harmonics_V1_THD || "00.00"}</span>
            </div>
            <div className="absolute meterDataText top-[385px] left-[492px] w-[96px] h-[29px] flex items-center justify-center">
              <span>{suffixTags.Harmonics_V2_THD || "00.00"}</span>
            </div>
            <div className="absolute meterDataText top-[464px] left-[492px] w-[96px] h-[29px] flex items-center justify-center">
              <span>{suffixTags.Harmonics_V3_THD || "00.00"}</span>
            </div>
            <div className="absolute meterDataText top-[302px] left-[815px] w-[110px] h-[32px] flex items-center justify-center">
              <span>N/A</span>
            </div>
            <div className="absolute meterDataText top-[386px] left-[815px] w-[110px] h-[30px] flex items-center justify-center">
              <span>N/A</span>
            </div>
            <div className="absolute meterDataText top-[467px] left-[815px] w-[110px] h-[30px] flex items-center justify-center">
              <span>N/A</span>
            </div>
            <div className="absolute meterDataText top-[303px] left-[978px] w-[98px] h-[30px] flex items-center justify-center">
              <span>N/A</span>
            </div>
            <div className="absolute meterDataText top-[386px] left-[978px] w-[98px] h-[30px] flex items-center justify-center">
              <span>N/A</span>
            </div>
            <div className="absolute meterDataText top-[467px] left-[978px] w-[98px] h-[30px] flex items-center justify-center">
              <span>N/A</span>
            </div>
            <div className="absolute meterDataText top-[304px] left-[1134px] w-[110px] h-[30px] flex items-center justify-center">
              <span>N/A</span>
            </div>
            <div className="absolute meterDataText top-[386px] left-[1134px] w-[110px] h-[30px] flex items-center justify-center">
              <span>N/A</span>
            </div>
            <div className="absolute meterDataText top-[467px] left-[1134px] w-[110px] h-[30px] flex items-center justify-center">
              <span>N/A</span>
            </div>

            <div className="absolute meterDataText top-[553px] left-[815px] w-[110px] h-[30px] flex items-center justify-center">
              <span>{suffixTags.ActivePower_Total || "00.00"}</span>
            </div>
            <div className="absolute meterDataText top-[553px] left-[978px] w-[99px] h-[30px] flex items-center justify-center">
              <span>{suffixTags.ReactivePower_Total || "00.00"}</span>
            </div>
            <div className="absolute meterDataText top-[553px] left-[1134px] w-[110px] h-[30px] flex items-center justify-center">
              <span>{suffixTags.ApparentPower_Total || "00.00"}</span>
            </div>
          </>
        ) : activeTab === "energy" ? (
          <>
            <div className="absolute meterDataText top-[224px] left-[325px] w-[154px] h-[40px] flex items-center justify-center">
              <span>N/A</span>
            </div>
            <div className="absolute meterDataText top-[312px] left-[325px] w-[154px] h-[40px] flex items-center justify-center">
              <span>N/A</span>
            </div>
            <div className="absolute meterDataText top-[400px] left-[325px] w-[154px] h-[40px] flex items-center justify-center">
              <span>N/A</span>
            </div>
            <div className="absolute meterDataText top-[224px] left-[566px] w-[154px] h-[40px] flex items-center justify-center">
              <span>N/A</span>
            </div>
            <div className="absolute meterDataText top-[312px] left-[566px] w-[154px] h-[40px] flex items-center justify-center">
              <span>N/A</span>
            </div>
            <div className="absolute meterDataText top-[400px] left-[566px] w-[154px] h-[40px] flex items-center justify-center">
              <span>N/A</span>
            </div>
            <div className="absolute meterDataText top-[224px] left-[801px] w-[154px] h-[40px] flex items-center justify-center">
              <span>N/A</span>
            </div>
            <div className="absolute meterDataText top-[312px] left-[801px] w-[154px] h-[40px] flex items-center justify-center">
              <span>N/A</span>
            </div>
            <div className="absolute meterDataText top-[400px] left-[801px] w-[154px] h-[40px] flex items-center justify-center">
              <span>N/A</span>
            </div>
            <div className="absolute meterDataText top-[485px] left-[325px] w-[154px] h-[40px] flex items-center justify-center">
              <span>{suffixTags.Del_ActiveEnergy || "00.00"}</span>
            </div>
            <div className="absolute meterDataText top-[485px] left-[566px] w-[154px] h-[40px] flex items-center justify-center">
              <span>{suffixTags.Rec_Active_Energy || "00.00"}</span>
            </div>
            <div className="absolute meterDataText top-[485px] left-[801px] w-[154px] h-[40px] flex items-center justify-center">
              <span>N/A</span>
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
              `/logs?type=${activeTab}&lt_scheme=${ltScheme}&val=${activeTab}&meter_id=${id}&meter-name=${meterName}`
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
