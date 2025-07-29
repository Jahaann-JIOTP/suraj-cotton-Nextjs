"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import config from "@/constant/apiRouteList";
import { ImArrowLeft2 } from "react-icons/im";
import { useTheme } from "next-themes";
import { FaRegFileAlt } from "react-icons/fa";

const page = () => {
  const [activeTab, setActiveTab] = useState("voltage");
  const [data, setData] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const { theme } = useTheme();
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
  console.log(suffixTags);
  const voltageData = [
    {
      tag: suffixTags.Voltage_CA,
      unit: "Vca",
      top: "144.5px",
      left: "29px",
      width: "113px",
      height: "37px",
    },
    {
      tag: suffixTags.Voltage_BC,
      unit: "Vbc",
      top: "69px",
      left: "187px",
      width: "113px",
      height: "37px",
    },
    {
      tag: suffixTags.Voltage_AB,
      unit: "Vab",
      top: "167px",
      left: "187px",
      width: "113px",
      height: "37px",
    },
    {
      tag: suffixTags.Voltage_Avg,
      unit: "V",
      top: "392px",
      left: "184px",
      width: "113px",
      height: "37px",
    },
    {
      tag: suffixTags.Current_C,
      unit: "A c",
      top: "28px",
      left: "328px",
      width: "113px",
      height: "37px",
    },
    {
      tag: suffixTags.Current_B,
      unit: "A b",
      top: "122px",
      left: "328px",
      width: "113px",
      height: "37px",
    },
    {
      tag: suffixTags.Current_A,
      unit: "A a",
      top: "215px",
      left: "328px",
      width: "113px",
      height: "37px",
    },
    {
      tag: suffixTags.Current_Avg,
      unit: "A",
      top: "337px",
      left: "328px",
      width: "113px",
      height: "37px",
    },
    {
      tag: "N/A",
      unit: "",
      top: "28px",
      left: "468px",
      width: "113px",
      height: "37px",
    },
    {
      tag: "N/A",
      unit: "",
      top: "122px",
      left: "468px",
      width: "113px",
      height: "37px",
    },
    {
      tag: "N/A",
      unit: "",
      top: "215px",
      left: "468px",
      width: "113px",
      height: "37px",
    },
    {
      tag: suffixTags.ActivePower_Total,
      unit: "KW",
      top: "290px",
      left: "468px",
      width: "113px",
      height: "37px",
    },
    {
      tag: suffixTags.ReactivePower_Total,
      unit: "KVAR",
      top: "373px",
      left: "468px",
      width: "113px",
      height: "37px",
    },
    {
      tag: suffixTags.ApparentPower_Total,
      unit: "KVA",
      top: "458px",
      left: "468px",
      width: "113px",
      height: "37px",
    },
    {
      tag: suffixTags.Voltage_AN,
      unit: "Van",
      top: "328px",
      left: "595px",
      width: "113px",
      height: "37px",
    },
    {
      tag: suffixTags.Voltage_BN,
      unit: "Vbn",
      top: "390px",
      left: "667px",
      width: "113px",
      height: "37px",
    },
    {
      tag: suffixTags.Voltage_CN,
      unit: "Vcn",
      top: "328px",
      left: "747px",
      width: "113px",
      height: "37px",
    },
    {
      tag: suffixTags.Frequency_Hz,
      unit: "",
      top: "73px",
      left: "872px",
      width: "138px",
      height: "37px",
    },
    {
      tag: suffixTags.PowerFactor_Avg,
      unit: "",
      top: "148px",
      left: "872px",
      width: "138px",
      height: "37px",
    },
    {
      tag: suffixTags.PowerFactor_A,
      unit: "",
      top: "220px",
      left: "872px",
      width: "138px",
      height: "37px",
    },
    {
      tag: suffixTags.PowerFactor_B,
      unit: "",
      top: "293px",
      left: "872px",
      width: "138px",
      height: "37px",
    },
    {
      tag: suffixTags.PowerFactor_C,
      unit: "",
      top: "367px",
      left: "872px",
      width: "138px",
      height: "37px",
    },
    {
      tag: suffixTags.Voltage_LN_Avg,
      unit: "",
      top: "439px",
      left: "872px",
      width: "138px",
      height: "37px",
    },
  ];
  const powerData = [
    {
      tag: suffixTags.Harmonics_I1_THD,
      unit: "",
      top: "178px",
      left: "40px",
      width: "106px",
      height: "39px",
    },
    {
      tag: suffixTags.Harmonics_I2_THD,
      unit: "",
      top: "257px",
      left: "41px",
      width: "106px",
      height: "39px",
    },
    {
      tag: suffixTags.Harmonics_I3_THD,
      unit: "",
      top: "335px",
      left: "41px",
      width: "106px",
      height: "39px",
    },
    {
      tag: suffixTags.Harmonics_V1_THD,
      unit: "",
      top: "179px",
      left: "359px",
      width: "106px",
      height: "39px",
    },
    {
      tag: suffixTags.Harmonics_V2_THD,
      unit: "",
      top: "257px",
      left: "359px",
      width: "106px",
      height: "39px",
    },
    {
      tag: suffixTags.Harmonics_V3_THD,
      unit: "",
      top: "336px",
      left: "359px",
      width: "106px",
      height: "39px",
    },
    {
      tag: "N/A",
      unit: "",
      top: "179px",
      left: "564px",
      width: "106px",
      height: "39px",
    },
    {
      tag: "N/A",
      unit: "",
      top: "258px",
      left: "564px",
      width: "106px",
      height: "39px",
    },
    {
      tag: "N/A",
      unit: "",
      top: "336px",
      left: "564px",
      width: "106px",
      height: "39px",
    },
    //todo
    {
      tag: suffixTags.ActivePower_Total,
      unit: "",
      top: "415px",
      left: "564px",
      width: "106px",
      height: "39px",
    },
    {
      tag: "N/A",
      unit: "",
      top: "179px",
      left: "728px",
      width: "106px",
      height: "39px",
    },
    {
      tag: "N/A",
      unit: "",
      top: "258px",
      left: "728px",
      width: "106px",
      height: "39px",
    },
    {
      tag: "N/A",
      unit: "",
      top: "336px",
      left: "728px",
      width: "106px",
      height: "39px",
    },
    // todo
    {
      tag: suffixTags.ReactivePower_Total,
      unit: "",
      top: "415px",
      left: "725px",
      width: "106px",
      height: "39px",
    },
    {
      tag: "N/A",
      unit: "",
      top: "179px",
      left: "897px",
      width: "106px",
      height: "39px",
    },
    {
      tag: "N/A",
      unit: "",
      top: "258px",
      left: "897px",
      width: "106px",
      height: "39px",
    },
    {
      tag: "N/A",
      unit: "",
      top: "336px",
      left: "897px",
      width: "106px",
      height: "39px",
    },
    {
      tag: suffixTags.ApparentPower_Total,
      unit: "",
      top: "415px",
      left: "896px",
      width: "106px",
      height: "39px",
    },
  ];
  const energyData = [
    {
      tag: suffixTags.ActiveEnergy_Imp_kWh,
      unit: "",
      top: "210px",
      left: "140px",
      width: "161px",
      height: "46px",
    },
    {
      tag: suffixTags.ActiveEnergy_Exp_kWh,
      unit: "",
      top: "301px",
      left: "140px",
      width: "161px",
      height: "46px",
    },
    {
      tag: "N/A",
      unit: "",
      top: "393px",
      left: "140px",
      width: "161px",
      height: "46px",
    },

    {
      tag: suffixTags.Del_ActiveEnergy,
      unit: "",
      top: "485px",
      left: "140px",
      width: "161px",
      height: "46px",
    },
    {
      tag: "N/A",
      unit: "",
      top: "210px",
      left: "485px",
      width: "161px",
      height: "46px",
    },
    {
      tag: "N/A",
      unit: "",
      top: "301px",
      left: "485px",
      width: "161px",
      height: "46px",
    },
    {
      tag: "N/A",
      unit: "",
      top: "393px",
      left: "485px",
      width: "161px",
      height: "46px",
    },
    {
      tag: suffixTags.Rec_Active_Energy,
      unit: "",
      top: "485px",
      left: "485px",
      width: "161px",
      height: "46px",
    },
    {
      tag: "N/A",
      unit: "",
      top: "210px",
      left: "830px",
      width: "161px",
      height: "46px",
    },
    {
      tag: "N/A",
      unit: "",
      top: "301px",
      left: "830px",
      width: "161px",
      height: "46px",
    },
    {
      tag: "N/A",
      unit: "",
      top: "393px",
      left: "830px",
      width: "161px",
      height: "46px",
    },
    {
      tag: "N/A",
      unit: "",
      top: "485px",
      left: "830px",
      width: "161px",
      height: "46px",
    },
  ];
  useEffect(() => {
    getSingleMeterData();
    const interval = setInterval(() => {
      getSingleMeterData();
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="relative w-full flex flex-col items-center bg-white dark:bg-gray-800 p-5 rounded-sm border-t-3 h-[81vh] border-[#1F5897]">
      <div className="flex items-center justify-between w-full overflow-hidden">
        <h1 className="font-semibold text-2xl font-inter pb-4">{meterName}</h1>
        <button
          onClick={() => router.back()}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={` flex items-center ${
            isHovered ? "justify-center" : "justify-start"
          } gap-2 h-[40px] cursor-pointer bg-[#1F5897] transition-all duration-300 ease-in-out overflow-hidden border-[3px] border-[#d8dfe7] dark:border-[#d8dfe738] text-white px-2 ${
            isHovered ? "w-[90px]" : "w-[40px]"
          }`}
          style={{
            borderRadius: isHovered ? "8px" : "50%",
          }}
        >
          <ImArrowLeft2 className="text-white shrink-0" />
          <span
            className={`whitespace-nowrap transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            Back
          </span>
        </button>
      </div>
      <div className="flex w-[1030px] mb-5 md:mb-auto items-center justify-center">
        <div
          className="flex flex-col md:flex-row items-center justify-center gap-1 rounded-sm bg-[#F9FAFB] dark:bg-[#f9fafb6c] p-1"
          style={{
            boxShadow:
              "0 -4px 30px rgba(0, 0, 0, 0.2), 0 4px 10px rgba(0, 0, 0, 0.2)",
          }}
        >
          <button
            onClick={() => setActiveTab("voltage")}
            className={`${
              activeTab === "voltage"
                ? "bg-[#1f5897] text-white"
                : "bg-[#EFF3F5] dark:bg-[#eff3f58a] text-black"
            } cursor-pointer px-3 w-[12rem] rounded py-1`}
          >
            Volts / Amps
          </button>
          <button
            onClick={() => setActiveTab("power")}
            className={`${
              activeTab === "power"
                ? "bg-[#1f5897] text-white"
                : "bg-[#EFF3F5] dark:bg-[#eff3f58a] text-black"
            } cursor-pointer px-3 w-[12rem] rounded py-1`}
          >
            Power & Power Quality
          </button>
          <button
            onClick={() => setActiveTab("energy")}
            className={`${
              activeTab === "energy"
                ? "bg-[#1f5897] text-white"
                : "bg-[#EFF3F5] dark:bg-[#eff3f58a] text-black"
            } cursor-pointer px-3 w-[12rem] rounded py-1`}
          >
            Energy
          </button>
        </div>
      </div>
      <div className="w-full mt-[20px] overflow-auto  h-[600px]">
        <div className="relative w-[1030px] flex items-start flex-col mx-auto">
          {activeTab === "voltage" ? (
            theme === "light" ? (
              <img
                src="../../volt-meter-light.png"
                alt=""
                className="w-[1030px]"
              />
            ) : (
              <img
                src="../../volt-meter-dark.png"
                alt=""
                className="w-[1030px]"
              />
            )
          ) : activeTab === "power" ? (
            theme === "light" ? (
              <img
                src="../../power-meter-ligth.png"
                alt=""
                className="w-[1030px]"
              />
            ) : (
              <img
                src="../../power-meter-dark.png"
                alt=""
                className="w-[1030px]"
              />
            )
          ) : activeTab === "energy" ? (
            theme === "light" ? (
              <img
                src="../../energy-meter-light.png"
                alt=""
                className="w-[1030px]"
              />
            ) : (
              <img
                src="../../energy-meter-dark.png"
                alt=""
                className="w-[1030px]"
              />
            )
          ) : (
            ""
          )}

          {/* values */}
          {activeTab === "voltage" ? (
            <>
              {voltageData.map((tag, index) => (
                <div
                  key={index}
                  className="absolute meterDataText  rounded-md flex items-center justify-center"
                  style={{
                    top: tag.top,
                    left: tag.left,
                    width: tag.width,
                    height: tag.height,
                  }}
                >
                  <span>
                    {tag.tag || "00.00"} {tag.unit}
                  </span>
                </div>
              ))}
            </>
          ) : activeTab === "power" ? (
            <>
              {powerData.map((tag, index) => (
                <div
                  key={index}
                  className="absolute meterDataText rounded-md flex items-center justify-center"
                  style={{
                    top: tag.top,
                    left: tag.left,
                    width: tag.width,
                    height: tag.height,
                  }}
                >
                  <span>
                    {tag.tag || "00.00"} {tag.unit}
                  </span>
                </div>
              ))}
            </>
          ) : activeTab === "energy" ? (
            <>
              {energyData.map((tag, index) => (
                <div
                  key={index}
                  className="absolute meterDataText rounded-md flex items-center justify-center"
                  style={{
                    top: tag.top,
                    left: tag.left,
                    width: tag.width,
                    height: tag.height,
                  }}
                >
                  <span>
                    {tag.tag || "00.00"} {tag.unit}
                  </span>
                </div>
              ))}
            </>
          ) : (
            ""
          )}
          {/* values */}
          {/* logs opener */}
        </div>
        <button
          title="Logs"
          onClick={() =>
            router.push(
              `/logs?type=${activeTab}&lt_scheme=${ltScheme}&val=${activeTab}&meter_id=${id}&meter-name=${meterName}`
            )
          }
          className={`absolute right-[20px] bottom-[5px] border-1 border-[#1F5897] text-[#1F5897] dark:bg-gray-500 font-400 rounded text-[12px] flex flex-col items-center justify-center p-[7px] z-30  cursor-pointer`}
          style={{
            boxShadow: "2px 2px 15px 2px #1f579775",
          }}
        >
          <FaRegFileAlt size={20} />
        </button>
      </div>
    </div>
  );
};

export default page;
