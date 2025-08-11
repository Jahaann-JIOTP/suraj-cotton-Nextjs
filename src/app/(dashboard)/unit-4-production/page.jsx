  "use client";

  import config from "@/constant/apiRouteList";
  import React, { useEffect, useState } from "react";
  import { toast } from "react-toastify";

  const Unit4Spindle = () => {
    const today = new Date();
    const [month, setMonth] = useState(today.getMonth());
    const year = today.getFullYear();
    const [getProductionData, setGetProductionData] = useState({});
    const [daysInMonth, setDaysInMonth] = useState([]);
    const [loading, setLoading] = useState(false);
    const [chunkSize, setChunkSize] = useState(15);
    const [singleDaySpindle, setSingleDaySpindle] = useState({});

    const [formMode, setFormMode] = useState("create"); // "create" or "update"
    const [recordId, setRecordId] = useState(null);
    const [productionData, setProductionData] = useState({
      unit: "U4",
      startDate: "",
      values: [],
    });
  
    // Generate days for current month
    useEffect(() => {
      const days = new Date(year, month + 1, 0).getDate();
      const datesArray = Array.from({ length: days }, (_, i) => {
        const day = i + 1;
        const monthStr = month + 1;
        return `${day}/${monthStr}/${year}`;
      });
      setDaysInMonth(datesArray);
    }, [month, year]);

    // Fetch production data
    const fetchSpindleProduction = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const monthStr = `${year}-${month + 1 < 10 ? "0" : ""}${month + 1}`;
        const response = await fetch(
          `${config.BASE_URL}${config.REPORTS.GET_SPINDLES}${monthStr}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const resResult = await response.json();

        if (response.ok) {
          const grouped = {};
          resResult.data.forEach(({ date, unit, value }) => {
            const d = new Date(date);

            const key = `${d.getDate()}/${
              d.getMonth() + 1
            }/${d.getFullYear()}-${unit}`;
            grouped[key] = (grouped[key] || 0) + value;
          });
          setGetProductionData(grouped);
        }
      } catch (error) {
        console.error(error.message);
      }
    };

    useEffect(() => {
      fetchSpindleProduction();
    }, [month]);

    // Form Handling
    const handleChange = (e) => {
      const { name, value } = e.target;
      setProductionData((prev) => ({
        ...prev,
        [name]:
          name === "values"
            ? !isNaN(parseFloat(value))
              ? [parseFloat(value)]
              : []
            : value,
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      const token = localStorage.getItem("token");
      if (!token) return;
      setLoading(true);

      try {
        if (formMode === "create") {
          // POST new record
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
            toast.success("Unit 4 Spindle Added");
            await fetchSpindleProduction();
          }
        }

        // Reset form after submit
        setProductionData((prev) => ({
          ...prev,
          values: [],
        }));
        setFormMode("create");
        setRecordId(null);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    const fetchSingleDaySpindle = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          `${config.BASE_URL}${config.REPORTS.GET_SINGLE_DAY_SPINDLE}unit=U4&date=${productionData.startDate}`,
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
              values: [resResult[0].value], // fill the value
            }));
            setRecordId(resResult[0]._id);
            setFormMode("update");
          } else {
            // No record → create mode
            setProductionData((prev) => ({
              ...prev,
              values: [],
            }));
            setRecordId(null);
            setFormMode("create");
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
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
            unit: "U4",
            date: productionData.startDate,
          }),
        });
        if (response.ok) {
          setProductionData({ unit: "U4", startDate: "", values: [] });
          toast.success("Unit 4 Spindles Updated");
          setLoading(false);
          await fetchSpindleProduction();
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    useEffect(() => {
      if (productionData.startDate) {
        fetchSingleDaySpindle();
      }
    }, [productionData.startDate]);

    // Responsive chunk size
    const getChunkSize = (width) => {
      if (width >= 1400) return 15;
      if (width >= 1200) return 12;
      if (width >= 992) return 10;
      if (width >= 768) return 8;
      if (width >= 576) return 6;
      if (width >= 400) return 3;
      if (width >= 340) return 2;
      return 4;
    };

    useEffect(() => {
      const handleResize = () => setChunkSize(getChunkSize(window.innerWidth));
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    const chunkArray = (arr, size) => {
      const result = [];
      for (let i = 0; i < arr.length; i += size)
        result.push(arr.slice(i, i + size));
      return result;
    };

    const getProductionByDate = (dateStr) => {
      const today = new Date();
      const [day, month, year] = dateStr.split("/").map(Number);
      const dateObj = new Date(year, month - 1, day);

      const unit4 = getProductionData[`${dateStr}-U4`] || 0;

      if (dateObj > today && unit4 === 0) return " ";

      if (productionData.unit === "U4") return unit4 !== 0 ? unit4 : "-";

      return unit4 === 0 ? "-" : unit4;
    };

    const dayChunks = chunkArray(daysInMonth, chunkSize);
    const slotWidth = `${100 / (chunkSize + 1)}%`;

    return (
      <div className="flex flex-col bg-white dark:bg-gray-800 w-full h-full md:h-[81vh] rounded-md border-t-3 overflow-x-auto border-[#1F5897] px-4 py-2">
        <h1 className="font-raleway text-[18.22px] text-black dark:text-white font-600">
          {formMode === "create"
            ? "Add Spindle Production Unit 4"
            : "Update Spindle Production Unit 4"}
        </h1>

        {/* Form */}
        <div className="w-full flex items-center justify-center">
          <div className="w-full md:w-[80%] lg:w-[50%] flex flex-col items-center">
            <form
              onSubmit={formMode === "create" ? handleSubmit : updateSpindle}
              className="w-full flex flex-col items-center mt-10"
            >
              <div className="flex flex-col items-center justify-center">
                <label className="font-inter text-[15px] pt-5 text-black  dark:text-white font-500">
                  Select Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  onChange={handleChange}
                  className="outline-none border-1 border-gray-300 dark:border-y-gray-500 rouded px-2 py-1.5 w-[12rem] rounded-sm"
                  value={productionData.startDate}
                />
              </div>
              <div className="flex flex-col items-center justify-center">
                <label className="font-inter text-[15px] pt-5 text-black dark:text-white font-500">
                  Enter Production
                </label>
                <input
                  type="number"
                  name="values"
                  onChange={handleChange}
                  className="outline-none border-1 border-gray-300 dark:border-y-gray-500 rouded px-2 py-1.5 w-[12rem] rounded-sm"
                  value={productionData.values}
                />
              </div>

              <button
                type="submit"
                className="bg-[#1F5897] cursor-pointer text-white px-5 py-1.5 rounded mt-4"
              >
                {loading === true ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>
        </div>

        {/* Slot Rows */}
        <div className="relative border-1 border-[#025697] px-3 mt-10">
          <div className="absolute mb-4 top-1 flex items-center gap-2">
            <label className="text-[12px]">Month:</label>
            <select
              value={month + 1}
              onChange={(e) => setMonth(parseInt(e.target.value) - 1)}
              className="border p-1 rounded-sm shadow text-[12px] w-[90px] outline-none font-400"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i + 1}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full flex items-center justify-center">
            <h2
              className="text-white bg-[#025697] px-10 py-1.5 text-[17.62px] font-inter font-500"
              style={{ clipPath: "polygon(10% 0, 90% 0, 100% 100%, 0 100%)" }}
            >
              History of daily production
            </h2>
          </div>

          {dayChunks.map((chunk, rowIndex) => (
            <div
              key={rowIndex}
              className="mb-6 w-full flex flex-col overflow-hidden"
            >
              {/* Date Row */}
              <div className="flex w-full items-center text-center">
                <div
                  style={{ width: slotWidth }}
                  className="flex-shrink-0 border-1 h-[28px] border-[#025697] border-r-white py-1 bg-[#E5F3FD] text-[10px] md:text-[12px] font-medium"
                >
                  Date
                </div>
                {chunk.map((dateStr, index) => (
                  <div
                    key={dateStr}
                    className={`flex-shrink-0 border-1 h-[28px] border-y-[#025697] ${
                      index === chunk.length - 1
                        ? "border-r-[#025697]"
                        : "border-r-white"
                    } py-1 bg-[#E5F3FD] text-[12px] font-medium`}
                    style={{ width: slotWidth }}
                  >
                    {dateStr}
                  </div>
                ))}
              </div>

              {/* Production Row */}
              <div className="flex w-full items-center text-center">
                <div
                  style={{ width: slotWidth }}
                  className="flex-shrink-0 font-semibold h-[53px] border-[#025697] border-t-transparent py-4 border text-[12px]"
                >
                  Production
                </div>
                {chunk.map((dateStr) => (
                  <div
                    key={dateStr}
                    className="flex-shrink-0 border py-4 h-[53px] border-r-[#025697] border-b-[#025697] border-t-transparent text-[12px]"
                    style={{ width: slotWidth }}
                  >
                    {getProductionByDate(dateStr)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  export default Unit4Spindle;
