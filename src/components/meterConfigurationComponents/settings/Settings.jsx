import config from "@/constant/apiRouteList";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

// Meters with display name and ID
const meters = [
  {
    name: "PDB1 CD1 + PDB 08",
    id: "U1_GW02",
    u4buttonText: "LT2-Card 1-8",
    u5buttonText: "LT1-Comber M/C 1-14",
  },
  {
    name: "PDB2 CD2 + Card PDB 01",
    id: "U2_GW02",
    u4buttonText: "LT2-Card9-14+1Breaker",
    u5buttonText: "LT1-Card M/C 8-14",
  },
  // { name: "Card PDB 01", id: "U3_GW02" },
  // { name: "PDB 08", id: "U4_GW02" },
  {
    name: "PDB 07",
    id: "U22_GW03",
    u4buttonText: "LT1-Ring 21-24",
    u5buttonText: "LT1-Auto Cone 1-9",
  },
  {
    name: "PDB 10",
    id: "U23_GW03",
    u4buttonText: "LT2-Ring 5-8",
    u5buttonText: "LT2-Auto Cone 10-18",
  },
];

const Settings = () => {
  const [selectedUnits, setSelectedUnits] = useState({});

  const [userData, setUserData] = useState({});
  const [meterToggleStatus, setMeterToggleStatus] = useState([]);
  const token = localStorage.getItem("token");

  /////////////////////////////////// fetch consumption calculation api
  const callhiddenConsumptionApi = async () => {
    try {
      const response = await fetch(`${config.BASE_URL}/meter/consumption`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch");
    } catch (error) {
      console.error(error);
    }
  };

  // toggle meter for storing real time values
  const postMeterWithrealTimeValues = async (meterId, unit) => {
    const token = localStorage.getItem("token");
    const currentUnit = selectedUnits[meterId];
    const targetAreaName = unit === 4 ? "Unit_4" : "Unit_5";
    const currentAreaName = currentUnit === 4 ? "Unit 4" : "Unit 5";
    // If already in the selected unit, no need to confirm
    if (currentUnit === unit) {
      return;
    }
    try {
      const response = await fetch(`${config.BASE_URL}/meter/fetch-real-time`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        await callhiddenConsumptionApi();
      }
    } catch (error) {
      console.error(error);
    }
  };
  // Fetch user details
  const fetchUserDetails = async () => {
    if (!token) return;

    try {
      const res = await fetch(`${config.BASE_URL}${config.USER.PROFILE}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUserData(data);
      } else {
        console.error("Failed to fetch user profile");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  // fetch current status of meters
  const fetchMeterToggleStatus = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await fetch(
        `${config.BASE_URL}${config.METER_CONFIG.GET_METER_TOGGLE_STATUS}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const resResult = await response.json();

      if (response.ok) {
        setMeterToggleStatus(resResult);

        // Map meter status to selectedUnits
        const initialUnits = {};
        resResult.forEach((item) => {
          initialUnits[item.meterId] = item.area === "unit4" ? 4 : 5;
        });
        setSelectedUnits(initialUnits);
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  // Toggle handler

  const handleToggle = async (meterId, unit) => {
    const currentUnit = selectedUnits[meterId];
    const targetAreaName = unit === 4 ? "Unit 4" : "Unit 5";
    const currentAreaName = currentUnit === 4 ? "Unit 4" : "Unit 5";

    if (currentUnit === unit) {
      Swal.fire({
        icon: "question",
        html: `This meter is already assigned to <b>${
          targetAreaName || "N/A"
        }</b>`,
      });
      return;
    }

    const result = await Swal.fire({
      title: "Confirm Switch",
      html: `
      Currently you are in <b>${currentAreaName || "N/A"}</b>.<br/>
      Are you sure you want to switch to <b>${targetAreaName}</b>?
    `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Switch",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#1A68B2",
      cancelButtonColor: "#d33",
    });

    if (!result.isConfirmed) {
      return; // User cancelled
    }

    // ✅ First update DB toggle
    try {
      const response = await fetch(
        `${config.BASE_URL}${config.METER_CONFIG.ADD_METER_TOGGLE}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            area: unit === 4 ? "unit4" : "unit5",
            meterId: meterId,
            email: userData.email,
            username: userData.name,
          }),
        }
      );

      const resResult = await response.json();
      if (response.ok) {
        toast.success(resResult.message);

        // ✅ Only after confirmation + success → update state
        setSelectedUnits((prev) => ({
          ...prev,
          [meterId]: unit,
        }));

        // ✅ Call real-time values API here
        await postMeterWithrealTimeValues(meterId, unit);

        fetchMeterToggleStatus();
      } else {
        toast.error(resResult.message);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchUserDetails();
    fetchMeterToggleStatus();
  }, []);

  return (
    <div className="px-4 md:px-20 rounded-md">
      <h1 className="text-2xl font-semibold mb-2 text-center text-[#1A68B2]">
        Meter Control Panel
      </h1>

      <div
        className="bg-white dark:bg-gray-800 rounded-2xl px-6 py-4 space-y-2"
        style={{
          boxShadow: "5px 5px 25px 10px rgba(0,0,0,0.1)",
        }}
      >
        <div className="flex items-center justify-between">
          <span className="text-[20px] font-inter text-[#1F5897]">METERS</span>
          <div className="w-[50%] flex items-center justify-around">
            <span className="text-[20px] font-inter text-[#1F5897]">
              Unit 4
            </span>
            <span className="text-[20px] font-inter text-[#1F5897]">
              Unit 5
            </span>
          </div>
        </div>
        <div className="w-full h-[2px] mt-3 mb-3 bg-gradient-to-r from-transparent via-[#1A68B2]  to-transparent"></div>
        {meters.map((meter, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 last:border-b-0"
          >
            <div className="w-[50%]">
              <span className="text-[16px] font-semibold text-gray-700 dark:text-gray-200">
                {meter.name}
              </span>
            </div>

            <div className="w-[50%] flex gap-4 justify-between">
              <button
                onClick={() => {
                  handleToggle(meter.id, 4);
                }}
                className={`px-4 py-2 text-[15px] rounded-md w-[15rem] cursor-pointer transition-all duration-300 ${
                  selectedUnits[meter.id] === 4
                    ? "bg-[#1A68B2] text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-[#cae5ff]"
                }`}
              >
                {meter.u4buttonText}
              </button>

              <button
                onClick={() => {
                  handleToggle(meter.id, 5);
                }}
                className={`px-4 py-2 rounded-md w-[15rem] cursor-pointer transition-all duration-300 ${
                  selectedUnits[meter.id] === 5
                    ? "bg-[#1A68B2] text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-[#cae5ff]"
                }`}
              >
                {meter.u5buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>
      <span className="font-inter font-400 text-[12px] pl-3">
        The highlighted blue button shows the selected meter area.
      </span>
    </div>
  );
};

export default Settings;
