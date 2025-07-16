import config from "@/constant/apiRouteList";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

// Meters with display name and ID
const meters = [
  { name: "Transport", id: "U1_PLC" },
  { name: "Unit 05 aux", id: "U2_PLC" },
  { name: "Lighting External", id: "U3_PLC" },
  { name: "Light Internal", id: "U4_PLC" },
  { name: "Power House", id: "U5_PLC" },
  { name: "Turbine", id: "U6_PLC" },
];

const Settings = () => {
  const [selectedUnits, setSelectedUnits] = useState({});
  const [userData, setUserData] = useState({});
  const [meterToggleStatus, setMeterToggleStatus] = useState([]);
  const token = localStorage.getItem("token");

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
    try {
      const response = await fetch(`${config.BASE_URL}/meter/toggles`, {
        method: "GET",
      });
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
    const areaName = unit === 4 ? "unit4" : "unit5";

    // ✅ Set selected unit for specific meter
    setSelectedUnits((prev) => ({
      ...prev,
      [meterId]: unit,
    }));

    try {
      const response = await fetch(`${config.BASE_URL}/meter/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          area: areaName,
          meterId: meterId,
          email: userData.email,
          username: userData.name,
        }),
      });

      const resResult = await response.json();
      if (response.ok) {
        toast.success(resResult.message);
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
    <div className="px-4 md:px-20">
      <h1 className="text-3xl font-bold mb-8 text-center text-[#1A68B2]">
        Meter Control Panel
      </h1>

      <div className="bg-white shadow-xl rounded-2xl p-6 space-y-4">
        {meters.map((meter, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 last:border-b-0"
          >
            <span className="text-lg font-semibold text-gray-700">
              {meter.name}
            </span>

            <div className="flex gap-4">
              <button
                onClick={() => handleToggle(meter.id, 4)}
                className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                  selectedUnits[meter.id] === 4
                    ? "bg-[#1A68B2] text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-[#cae5ff]"
                }`}
              >
                Unit 4
              </button>
              <button
                onClick={() => handleToggle(meter.id, 5)}
                className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                  selectedUnits[meter.id] === 5
                    ? "bg-[#1A68B2] text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-[#cae5ff]"
                }`}
              >
                Unit 5
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settings;
