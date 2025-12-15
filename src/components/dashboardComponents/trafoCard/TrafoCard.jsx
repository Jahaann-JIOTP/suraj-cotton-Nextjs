"use client";
import { Divider, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import CustomLoader from "@/components/customLoader/CustomLoader";

const TrafoCard = ({
  mainTitle,
  icomingValue,
  iconmingUnit,
  outgoingValue,
  outgoingUnit,
  lossesValue,
  lossesUnit,
  loading,
  lossesPercent,
  lossesPercentUnit,
}) => {
  const [mounted, setMounted] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return (
    <div className="w-full bg-white dark:bg-gray-800 h-full shadow-md lg:h-[30vh] rounded-md border-t-3 border-[#1A68B2] px-1 p-7 pb-10 flex flex-col items-center justify-evenly ">
      <span className="text-[17px] text-[#1A68B2] mb-7 md:mb-auto font-700 font-inter">
        {mainTitle}
      </span>
      <div className="flex items-center flex-col md:flex-row gap-5 md:gap-auto justify-evenly w-full">
        <div className="flex flex-col items-center justify-center">
          <span className="text-[16.34px] text-[#1A68B2] font-500 font-inter">
            Incoming
          </span>
          <div>
            {loading ? (
              // <span>Loading...</span>
              <CustomLoader size="32px" />
            ) : (
              <div className="flex items-center gap-1">
                <span className="text-[18px] text-black dark:text-white font-inter font-500">
                  {icomingValue}
                </span>
                <span className="text-[18px] text-black dark:text-white font-inter font-500">
                  {iconmingUnit}
                </span>
              </div>
            )}
          </div>
        </div>
        <Divider
          orientation={isSmallScreen ? "horizontal" : "vertical"}
          variant="middle"
          flexItem
          className="dark:bg-gray-200"
        />
        <div className="flex flex-col items-center justify-center">
          <span className="text-[16.34px] text-[#1A68B2] font-500 font-inter">
            Outgoing
          </span>
          {loading ? (
            <CustomLoader size="32px" />
          ) : (
            <div className="flex items-center gap-1">
              <span className="text-[18px] text-black dark:text-white font-inter font-500">
                {outgoingValue}
              </span>
              <span className="text-[18px] text-black dark:text-white font-inter font-500">
                {outgoingUnit}
              </span>
            </div>
          )}
        </div>
        <Divider
          orientation={isSmallScreen ? "horizontal" : "vertical"}
          variant="middle"
          flexItem
          className="dark:bg-gray-200"
        />
        <div className="flex flex-col items-center justify-center">
          <span className="text-[16.34px] text-[#1A68B2] font-500 font-inter">
            Net Losses
          </span>
          {loading ? (
            <CustomLoader size="32px" />
          ) : (
            <div className="flex items-center gap-1">
              <span className="text-[18px] text-black dark:text-white font-inter font-500">
                {lossesValue}
              </span>
              <span className="text-[18px] text-black dark:text-white font-inter font-500">
                {lossesUnit}
              </span>
            </div>
          )}
        </div>
        <Divider
          orientation={isSmallScreen ? "horizontal" : "vertical"}
          variant="middle"
          flexItem
          className="dark:bg-gray-200"
        />
        <div className="flex flex-col items-center justify-center">
          <span className="text-[16.34px] text-[#1A68B2] font-500 font-inter">
            Losses (%)
          </span>
          {loading ? (
            <CustomLoader size="32px" />
          ) : (
            <div className="flex items-center gap-1">
              <span className="text-[18px] text-black dark:text-white font-inter font-500">
                {lossesPercent}
              </span>
              <span className="text-[18px] text-black dark:text-white font-inter font-500">
                {lossesPercentUnit}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrafoCard;
