"use client";
import React, { use, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import config from "@/constant/apiRouteList";

const page = ({ params }) => {
  // const [activeTab, setActiveTab] = useState("voltage");
  const [activeTab, setActiveTab] = useState("energy");
  const [data, setData] = useState([]);
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const area = searchParams.get("area");
  const ltScheme = searchParams.get("lt_scheme");

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
  const prefix = "U8_PLC_";

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
        <h1 className="font-semibold text-2xl font-inter pb-4">Wapda</h1>
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
            <div className="absolute top-[260px] left-[100px]">
              {suffixTags.Voltage_CA}
            </div>
            <div className="absolute top-[200px] left-[200px]">
              {suffixTags.Voltage_AB}
            </div>
            <div className="absolute top-[310px] left-[200px]">
              {suffixTags.Voltage_BC}
            </div>
            <div className="absolute top-[140px] left-[400px]">
              {suffixTags.Current_C}
            </div>
            <div className="absolute top-[250px] left-[400px]">
              {suffixTags.Current_B}
            </div>
            <div className="absolute top-[370px] left-[400px]">
              {suffixTags.Current_A}
            </div>
            <div className="absolute top-[570px] left-[200px]">
              {suffixTags.Voltage_Avg}
            </div>
            <div className="absolute top-[520px] left-[400px]">
              {suffixTags.Current_Avg}
            </div>
            <div className="absolute top-[135px] left-[580px]">N/A</div>
            <div className="absolute top-[255px] left-[580px]">N/A</div>
            <div className="absolute top-[370px] left-[580px]">N/A</div>
            <div className="absolute top-[440px] left-[580px]">
              {suffixTags.ActivePower_Total}
            </div>
            <div className="absolute top-[510px] left-[580px]">
              {suffixTags.ReactivePower_Total}
            </div>
            <div className="absolute top-[570px] left-[580px]">
              {suffixTags.ApparentPower_Total}
            </div>
            <div className="absolute top-[490px] left-[720px]">
              {suffixTags.Voltage_AN}
            </div>
            <div className="absolute top-[490px] left-[860px]">
              {suffixTags.Voltage_BN}
            </div>
            <div className="absolute top-[490px] left-[1030px]">
              {suffixTags.Voltage_CN}
            </div>
            <div className="absolute top-[215px] left-[1180px]">N/A</div>
            <div className="absolute top-[280px] left-[1180px]">
              {suffixTags.PowerFactor_Avg}
            </div>
            <div className="absolute top-[340px] left-[1180px]">N/A</div>
            <div className="absolute top-[400px] left-[1180px]">N/A</div>
            <div className="absolute top-[460px] left-[1180px]">N/A</div>
            <div className="absolute top-[520px] left-[1180px]">
              {suffixTags.Voltage_LN_Avg}
            </div>
          </>
        ) : activeTab === "power" ? (
          <>
            <div className="absolute top-[305px] left-[190px]">N/A</div>
            <div className="absolute top-[390px] left-[190px]">N/A</div>
            <div className="absolute top-[470px] left-[190px]">N/A</div>
            <div className="absolute top-[305px] left-[530px]">N/A</div>
            <div className="absolute top-[390px] left-[530px]">N/A</div>
            <div className="absolute top-[470px] left-[530px]">N/A</div>
            <div className="absolute top-[305px] left-[870px]">N/A</div>
            <div className="absolute top-[390px] left-[870px]">N/A</div>
            <div className="absolute top-[470px] left-[870px]">N/A</div>
            <div className="absolute top-[305px] left-[1020px]">N/A</div>
            <div className="absolute top-[390px] left-[1020px]">N/A</div>
            <div className="absolute top-[470px] left-[1020px]">N/A</div>
            <div className="absolute top-[305px] left-[1180px]">N/A</div>
            <div className="absolute top-[390px] left-[1180px]">N/A</div>
            <div className="absolute top-[470px] left-[1180px]">N/A</div>

            <div className="absolute top-[560px] left-[870px]">
              {suffixTags.ApparentPower_Total}
            </div>
            <div className="absolute top-[560px] left-[1020px]">
              {suffixTags.ActivePower_Total}
            </div>
            <div className="absolute top-[560px] left-[1180px]">
              {suffixTags.ReactivePower_Total}
            </div>
          </>
        ) : activeTab === "energy" ? (
          <>
            <div className="absolute top-[230px] left-[350px]">N/A</div>
            <div className="absolute top-[320px] left-[350px]">N/A</div>
            <div className="absolute top-[410px] left-[350px]">N/A</div>
            <div className="absolute top-[230px] left-[630px]">N/A</div>
            <div className="absolute top-[320px] left-[630px]">N/A</div>
            <div className="absolute top-[410px] left-[630px]">N/A</div>
            <div className="absolute top-[230px] left-[860px]">N/A</div>
            <div className="absolute top-[320px] left-[860px]">N/A</div>
            <div className="absolute top-[410px] left-[860px]">N/A</div>
            <div className="absolute top-[490px] left-[370px]">
              {suffixTags.ApparentPower_Total}
            </div>
            <div className="absolute top-[490px] left-[630px]">
              {suffixTags.ActivePower_Total}
            </div>
            <div className="absolute top-[490px] left-[860px]">
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
              `/sld/${id}/${activeTab}?lt_scheme=${ltScheme}&val=${activeTab}&meter_id=${id}`
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
