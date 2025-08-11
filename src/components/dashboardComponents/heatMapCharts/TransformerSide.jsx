import config from "@/constant/apiRouteList";
import { Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { BiReset } from "react-icons/bi";
import { toast } from "react-toastify";
const TransformerSide = ({
  onMaintenanceUpdated,
  transformerReading,
  nxtMaintenance,
  remainingHrs,
  traffoTemp,
  losses,
  trafoName,
}) => {
  const [openModel, setOpenModel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hours, setHours] = useState(nxtMaintenance);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;
    setLoading(true);

    try {
      const response = await fetch(
        `${config.BASE_URL}${config.DASHBOARD.ADD_MAINTENANCE_HOURS}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            transformerName: trafoName,
            value: Number(hours),
          }),
        }
      );
      if (response.ok) {
        setHours("");
        setLoading(false);
        setOpenModel(false);
        toast.success("Next Maintenance Hours Updated");
        onMaintenanceUpdated?.(trafoName);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    setHours(nxtMaintenance);
  }, [nxtMaintenance]);
  return (
    <>
      <div className="w-ful flex flex-col items-center justify-start">
        <div className="w-[100px] relative">
          <div className="text-green-400 text-[11px] absolute w-[48px] h-[16px]  top-[45px] left-[25px] flex items-center justify-center">
            {transformerReading}
          </div>
          <img
            src="../../../heatmapTransformer.png"
            className="w-[110px]"
            alt=""
          />
        </div>
        <div className="relative flex flex-col items-center justify-center">
          <span className="font-raleway font-500 text-center text-[11px]">
            Nxt. Maintenance Hrs
          </span>
          <div
            className={`bg-[#424242] flex items-center justify-center text-[15px] ${
              remainingHrs <= 0 ? "text-red-500" : "text-green-400"
            } w-[80px] h-[20px]`}
          >
            {nxtMaintenance || "000"}
          </div>
          <Tooltip
            title={"Reset Maintenance Hours"}
            arrow
            placement="left"
            slotProps={{
              tooltip: {
                sx: {
                  bgcolor: "#025697",
                  color: "#ffffff",
                  fontSize: "12px",
                  fontWeight: 500,
                },
              },
              arrow: {
                sx: {
                  color: "#025697",
                },
              },
            }}
          >
            <button
              onClick={() => setOpenModel(true)}
              className="absolute right-[-10px] hover:bg-[#1F5897] hover:text-white top-4 cursor-pointer border-1 border-gray-500 p-[1px] rounded-[3px]"
            >
              <BiReset />
            </button>
          </Tooltip>
        </div>
        <div className="flex flex-col items-center justify-center">
          <span className="font-raleway font-500 text-[11px]">
            Remaining Hrs
          </span>
          <div className="bg-[#424242] flex items-center justify-center text-[15px] text-green-400 w-[80px] h-[20px]">
            {remainingHrs}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <span className="font-raleway font-500 text-[11px]">
            Traffo Temp.
          </span>
          <div className="bg-[#424242] flex items-center justify-center text-[10px] text-green-400 w-[80px] h-[20px]">
            {traffoTemp}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <span className="font-raleway font-500 text-[11px]">% Losses</span>
          <div className="bg-[#424242] flex items-center justify-center text-[15px] text-green-400 w-[80px] h-[20px]">
            {losses} %
          </div>
        </div>
      </div>
      {openModel && (
        <div className="absolute top-0 left-0 w-full h-screen flex items-center justify-center bg-black/80 dark:bg-gray-600/80 z-50">
          <div className="bg-white relative dark:bg-gray-800 w-[90%] md:w-[50%] lg:w-[30%] p-8 rounded-md border-t-3 flex flex-col items-center justify-center border-[#3978A8]">
            <h2 className="text-[20px] font-500 font-inter pb-6">
              Update Next Maintenance Hours
            </h2>
            <button 
            className="absolute top-2 right-2 text-red-500 cursor-pointer"
            onClick={()=>setOpenModel(false)}><RxCross2 size={20}/></button>
            <form
              onSubmit={handleSubmit}
              className="flex gap-3 flex-col items-center w-full justify-center"
            >
              <div className="flex flex-col w-full gap-2">
                <label htmlFor="maintenanceHrs">Enter Maintenance Hours</label>
                <input
                  type="number"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  id="maintenanceHrs"
                  name="maintenanceHrs"
                  placeholder="Please Enter a Valid Number"
                  className="w-full border-1 border-gray-300 dark:border-gray-500 outline-none rounded py-[8px] px-2"
                />
              </div>
              <button
                type="submit"
                className="bg-[#3978A8] rounded py-2 px-6 font-500 font-inter cursor-pointer text-[15px] text-white"
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default TransformerSide;
