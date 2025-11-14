"use client";

import ProductionTable from "@/components/productionComponents/ProductionTable";
import config from "@/constant/apiRouteList";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const Unit4Spindle = () => {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const year = today.getFullYear();
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [unit, setUnit] = useState("U4");
  const [isOpen, setIsOpen] = useState(false);
  const [getProductionData, setGetProductionData] = useState({});
  const [singleDaySpindle, setSingleDaySpindle] = useState({});

  const [formMode, setFormMode] = useState("create");
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const [productionData, setProductionData] = useState({
    unit: unit,
    startDate: "",
    values: [],
    avgcount: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductionData((prev) => ({
      ...prev,
      [name]:
        name === "values"
          ? !isNaN(Number.parseFloat(value))
            ? [Number.parseFloat(value)]
            : []
          : name === "avgcount"
          ? [Number.parseFloat(value)]
          : value,
    }));
  };
  const handleUnitChange = (selectedUnit) => {
    setUnit(selectedUnit);
    setProductionData((prev) => ({
      ...prev,
      unit: selectedUnit, // ✅ also update productionData
    }));
    setIsOpen(false); // if you want dropdown to close
  };

  /** 🧩 Generate days in month */
  useEffect(() => {
    const days = new Date(year, month + 1, 0).getDate();
    const arr = Array.from({ length: days }, (_, i) => {
      const d = i + 1;
      return `${d}/${month + 1}/${year}`;
    });
    setDaysInMonth(arr);
  }, [month, year]);

  /** 🧩 Fetch API */
  const fetchSpindleProduction = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const monthStr = `${year}-${month + 1 < 10 ? "0" : ""}${month + 1}`;
      const res = await fetch(
        `${config.BASE_URL}${config.REPORTS.GET_SPINDLES}${monthStr}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const result = await res.json();

      if (res.ok) {
        const grouped = {};
        result.data.forEach(({ date, unit, value, avgcount }) => {
          const key = `${new Date(date).getDate()}/${
            month + 1
          }/${year}-${unit}`;
          if (!grouped[key]) grouped[key] = { production: 0, avgcount: 0 };
          grouped[key].production += value;
          grouped[key].avgcount = avgcount ?? 0;
        });
        setGetProductionData(grouped);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch data");
    }
  };

  useEffect(() => {
    fetchSpindleProduction();
  }, [month]);
  const toggleDropdown = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  //==================add Production===========================
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;
    if (productionData.values.length <= 0) {
      toast.error("Please Enter Valid Number");
      setLoading(false);
      return null;
    }
    if (!productionData.unit) {
      toast.warning("Please Select Any Unit");
      return;
    }
    setLoading(true);
    try {
      if (formMode === "create") {
        const response = await fetch(
          `${config.BASE_URL}${config.REPORTS.ADD_SPINDLES}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(productionData),
          }
        );

        if (response.ok) {
          toast.success("Unit 4 Bags Added");
          await fetchSpindleProduction();
        }
      }

      setProductionData((prev) => ({
        ...prev,
        values: [],
        startDate: "",
        avgcount: [],
      }));
      setFormMode("create");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  //==================updated Production===========================
  const updateSpindle = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch(`${config.BASE_URL}/production`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: singleDaySpindle._id,
          value: Number(productionData.values.join()),
          avgcount: Number(productionData.avgcount.join()),
          unit: productionData.unit,
          date: productionData.startDate,
        }),
      });
      if (response.ok) {
        setProductionData({
          unit: unit,
          startDate: "",
          values: [],
          avgcount: [],
        });
        toast.success(" Bags Updated");
        setLoading(false);
        await fetchSpindleProduction();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  //==================fetch single day Production===========================

  const fetchSingleDaySpindle = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${config.BASE_URL}${config.REPORTS.GET_SINGLE_DAY_SPINDLE}unit=${productionData.unit}&date=${productionData.startDate}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const resResult = await response.json();

      if (response.ok) {
        if (resResult.length > 0) {
          setSingleDaySpindle(resResult[0]);
          setProductionData((prev) => ({
            ...prev,
            values: [resResult[0].value],
            avgcount: [resResult[0].avgcount],
          }));
          setFormMode("update");
        } else {
          setProductionData((prev) => ({
            ...prev,
            values: [],
          }));
          setFormMode("create");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (productionData.startDate && productionData.unit) {
      fetchSingleDaySpindle();
    }
  }, [productionData.startDate, productionData.unit]);
  /** 🧩 Define table rows */
  const rows = [
    { label: "Production", key: "production" },
    { label: "Avg Count", key: "avgcount" },
  ];
  const AddProductionTitle =
    productionData.unit === "U4"
      ? "Add Bags Production of Unit 4"
      : productionData.unit === "U5"
      ? "Add Bags Production of Unit 5"
      : "Daily Production Summary";
  const UpdateProductionTitle =
    productionData.unit === "U4"
      ? "Update Bags Production of Unit 4"
      : productionData.unit === "U5"
      ? "Update Bags Production of Unit 5"
      : "Daily Production Summary";
  return (
    <div className="flex flex-col bg-white dark:bg-gray-800 w-full h-[81vh] overflow-y-auto rounded-md border-t-3 border-[#1F5897] px-4 py-2">
      <h1 className="font-raleway text-[18.22px] text-black dark:text-white font-600">
        {formMode === "create" ? AddProductionTitle : UpdateProductionTitle}
      </h1>

      {/* Form */}
      <div className="w-full flex items-center justify-center mt-5">
        <form
          onSubmit={formMode === "create" ? handleSubmit : updateSpindle}
          className="w-full grid grid-cols-1 md:grid-cols-4 gap-4 items-start"
        >
          {/* --- Select Unit --- */}
          <div className="flex flex-col w-full items-start justify-center">
            <span className="text-[15px] font-500 font-inter text-black dark:text-white">
              Select Plant Unit
            </span>
            <div className="relative w-full" ref={dropdownRef}>
              <button
                type="button"
                onClick={toggleDropdown}
                className="w-full bg-white dark:bg-gray-800 border cursor-pointer border-gray-300 dark:border-gray-600 text-black dark:text-white px-4 py-2 rounded text-sm text-left"
              >
                {unit === "U4"
                  ? "Unit 4"
                  : unit === "U5"
                  ? "Unit 5"
                  : "Select Unit"}
              </button>

              {isOpen && (
                <div className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow-md">
                  <label className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer gap-2 text-[13.51px] font-500 font-inter text-black dark:text-white">
                    <input
                      type="radio"
                      checked={unit === "U4"}
                      onChange={() => handleUnitChange("U4")}
                    />
                    Unit 4
                  </label>
                  <label className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer gap-2 text-[13.51px] font-500 font-inter text-black dark:text-white">
                    <input
                      type="radio"
                      checked={unit === "U5"}
                      onChange={() => handleUnitChange("U5")}
                    />
                    Unit 5
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* --- Select Date --- */}
          <div className="flex flex-col items-start justify-center">
            <label className="font-inter text-[15px] text-black dark:text-white font-500">
              Select Date
            </label>
            <input
              type="date"
              name="startDate"
              required={true}
              onChange={handleChange}
              className="outline-none border border-gray-300 dark:border-gray-500 rounded px-2 py-1.5 w-full"
              value={productionData.startDate}
            />
          </div>

          {/* --- Production --- */}
          <div className="flex flex-col items-start justify-center">
            <label className="font-inter text-[15px] text-black dark:text-white font-500">
              Enter Production
            </label>
            <input
              type="number"
              name="values"
              placeholder="000"
              required={true}
              onChange={handleChange}
              className="outline-none border border-gray-300 dark:border-gray-500 rounded px-2 py-1.5 w-full"
              value={productionData.values}
            />
          </div>

          {/* --- Avg Count --- */}
          <div className="flex flex-col items-start justify-center">
            <label className="font-inter text-[15px] text-black dark:text-white font-500">
              Enter Avg Count
            </label>
            <input
              type="number"
              name="avgcount"
              required={true}
              placeholder="000"
              onChange={handleChange}
              className="outline-none border border-gray-300 dark:border-gray-500 rounded px-2 py-1.5 w-full"
              value={productionData.avgcount}
            />
          </div>

          {/* --- Submit Button (Full width, centered) --- */}
          <div className="col-span-full flex justify-center mt-4">
            <button
              type="submit"
              className="bg-[#1F5897] cursor-pointer text-white px-6 py-2 rounded"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
      <div className="p-3 mt-5 flex flex-col gap-3">
        <ProductionTable
          days={daysInMonth}
          data={getProductionData}
          rows={rows}
          month={month}
          setMonth={setMonth}
          unit={productionData.unit}
        />
      </div>
    </div>
  );
};

export default Unit4Spindle;
