"use client";

import { useEffect, useState, useMemo } from "react";
import AlarmTypeModal from "@/components/alarmsComponents/Alarm_Type_Modal";
import DeleteModal from "@/components/alarmsComponents/Delete_Modal";
import { useRouter } from "next/navigation";
import config from "../../../config";
import Image from "next/image";
import CustomLoader from "@/components/customLoader/CustomLoader";

export default function Index() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alarms, setAlarms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAlarm, setSelectedAlarm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalsOpen, setIsDeleteModalOpen] = useState(false);
  const router = useRouter();
  const alarmsPerPage = 3;

  // Sort alarms by priority (ascending order)
  const sortedAlarms = useMemo(() => {
    // avoid mutating state by copying first
    return [...alarms].sort((a, b) => a.priority - b.priority);
  }, [alarms]);

  const totalPages = Math.max(
    1,
    Math.ceil(sortedAlarms.length / alarmsPerPage)
  );
  const handleViewClick = (alarm) => {
    router.push(
      `/alarm_config?data=${encodeURIComponent(JSON.stringify(alarm))}`
    );
  };

  useEffect(() => {
    // Fetch alarm data from API
    const fetchAlarms = async () => {
      try {
        const response = await fetch(
          `${config.BASE_URL}/alarms/all-types-alarms`
        );
        const data = await response.json();

        setAlarms(data); // Set the fetched alarm data
      } catch (error) {
        console.error("Error fetching alarm data:", error);
      } finally {
        setIsLoading(false); // Stop loading when the data is fetched
      }
    };

    fetchAlarms(); // Call the function to fetch alarms
  }, []);

  const priorityLabels = {
    1: "Priority 1",
    2: "Priority 2",
    3: "Priority 3",
    4: "Priority 4",
    5: "Priority 5",
  };

  const indexOfLastAlarm = currentPage * alarmsPerPage;
  const indexOfFirstAlarm = indexOfLastAlarm - alarmsPerPage;
  const currentAlarms = sortedAlarms.slice(indexOfFirstAlarm, indexOfLastAlarm);

  const refreshAlarms = async () => {
    try {
      const response = await fetch(
        `${config.BASE_URL}/alarms/all-types-alarms`
      );
      const data = await response.json();
      setAlarms(data);
    } catch (error) {
      console.error("Error fetching alarm data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshAlarms();
  }, []);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handleBack = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const canGoNext = currentPage < totalPages;
  const canGoBack = currentPage > 1;

  const handleAddClick = () => {
    setSelectedAlarm(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (alarm) => {
    setSelectedAlarm(alarm);
    setIsModalOpen(true);
  };
  const handleDeleteClick = (alarm) => {
    setSelectedAlarm(alarm);
    setIsDeleteModalOpen(true);
  };

  const [modalKey, setModalKey] = useState(0);

  const handleTypeModalClose = () => {
    setIsModalOpen(false);
    setSelectedAlarm(null); // clear edit data
    setModalKey((k) => k + 1); // force remount on next open
  };

  const handleDelete = () => {
    refreshAlarms(); // Re-fetch alarms after delete
  };
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <>
      <div className="w-full p-4 min-h-[81vh] rounded-[8px] bg-white dark:bg-gray-800 !border-t-4 !border-t-[#1d5999] overflow-x-auto custom-scrollbar">
        <div className="w-full flex justify-between items-start flex-wrap mb-3">
          <div className="text-left">
            <span className="text-2xl text-[#626469] dark:text-white font-semibold">
              Alarm Type Configuration
            </span>
            <p className="mt-1 dark:text-white text-[15.04px] text-[#7E7E7E]">
              Define and manage alarm priority levels, their visual identity,
              and acknowledgement rules.
            </p>
          </div>

          {alarms.length !== 0 && (
            <div className="py-3 sm:mt-0">
              <button
                onClick={handleAddClick}
                className="bg-[#025697] cursor-pointer !font-[Inter] text-white px-4 py-2 rounded hover:bg-[#024080] text-sm font-medium"
              >
                + Add Alarm Type
              </button>
            </div>
          )}
        </div>

        {isLoading ? (
          <CustomLoader />
        ) : alarms.length === 0 ? (
          <div className="flex items-start gap-[21px] mt-[79px] w-full max-w-full mx-auto">
            <div className="flex-1 flex flex-col items-center mt-[5px]">
              <Image
                src="/alarm_bell.png"
                alt="No Alarms"
                className="w-[30vh] h-[29vh] mb-6"
                width={300}
                height={300}
              />
              <div className="text-center text-[#17282F] text-[15px] font-normal tracking-[-0.3px] mb-[23px]">
                <div className="mb-1 mt-[7vh] text-[rgba(23, 40, 47, 0.81)] dark:text-white font-semibold font-[Inter]">
                  No Alarms Level Configured yet!
                </div>
                <div className="text-[rgba(23, 40, 47, 0.53)] font-[Inter] dark:text-white">
                  Set up your first priority level to start managing alarms
                </div>
              </div>
              <button
                onClick={handleAddClick}
                className="cursor-pointer bg-[#025697] text-white text-sm font-medium min-h-[38px] w-[151px] px-[18px] py-[9px] rounded-md hover:bg-[#024080] transition-colors flex items-center justify-center gap-[10px]"
              >
                Add Alarms Type
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="text-[#484848] mt-5 text-[20px] !font-[Inter] font-semibold dark:text-white">
              Total Level Configured:{" "}
              <span className="text-inline !dark:text-white">
                {alarms.length.toString().padStart(2, "0")}
              </span>
            </div>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {currentAlarms.map((alarm, idx) => (
                <div
                  key={idx}
                  className={`rounded-lg border shadow-sm p-4 min-w-full max-w-sm !dark:bg-gray-800 dark:border-gray-700`}
                  style={{
                    backgroundColor: `rgba(${parseInt(
                      alarm.color.slice(1, 3),
                      16
                    )}, ${parseInt(alarm.color.slice(3, 5), 16)}, ${parseInt(
                      alarm.color.slice(5, 7),
                      16
                    )}, 0.1)`,
                  }}
                >
                  <h3 className="!font-[Inter] text-center text-md font-bold uppercase text-black dark:text-white mb-4">
                    Alarm Type {alarm.type}
                  </h3>
                  <div className="mb-3">
                    <label className="!font-[Inter] block text-sm font-semibold text-black dark:text-white mb-1">
                      Alarm Priority:
                    </label>
                    <input
                      type="text"
                      value={
                        priorityLabels[alarm.priority] ||
                        `Priority ${alarm.priority}`
                      } // Default fallback if not in the mapping
                      readOnly
                      className="!font-[Inter] w-full px-3 py-1.5 rounded border text-sm border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white cursor-default"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="!font-[Inter] block text-sm font-semibold text-black dark:text-white mb-1">
                      Set Color
                    </label>
                    <div className="w-full rounded-md border border-black/15 dark:border-white/20 p-[4px] flex gap-1 dark:bg-gray-700">
                      <div className="flex items-center gap-2 w-[70%] px-2 py-1 rounded-[2.003px] bg-[rgba(217,217,217,0.49)] dark:bg-gray-600">
                        <div
                          className="w-6 h-5 rounded-[4px] border border-black/20"
                          style={{ backgroundColor: alarm.color }}
                        ></div>
                        <input
                          type="text"
                          value={alarm.color}
                          readOnly
                          className="text-xs !font-[Inter] text-black dark:text-white bg-transparent border-none outline-none w-full"
                        />
                      </div>
                      <div className="w-[30%] flex items-center justify-center text-xs !font-[Inter] text-black dark:text-white px-1 py-1 rounded-[2.003px] bg-[rgba(217,217,217,0.49)] dark:bg-gray-600">
                        100%
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="!font-[Inter] block text-sm font-semibold text-black dark:text-white mb-1">
                      Acknowledgement Type:
                    </label>
                    <div className="dark:text-white flex items-center gap-2 text-[#025697] font-[Inter] text-[12px] not-italic font-normal leading-[174%]">
                      {alarm.acknowledgeType === "Both"
                        ? "Single + Mass Acknowledgement"
                        : "Single Acknowledgement"}
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      onClick={() => handleViewClick(alarm)}
                      className="cursor-pointer !font-[Inter] bg-[#007A1F] text-white text-[12px] px-4 py-1 rounded hover:bg-green-700"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEditClick(alarm)}
                      className="cursor-pointer !font-[Inter] bg-[#025697] text-white text-[12px] px-4 py-1 rounded hover:bg-[#024080]"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDeleteClick(alarm)}
                      className="cursor-pointer !font-[Inter] bg-red-600 text-white text-[12px] px-4 py-1 rounded hover:bg-[#B60101]"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-6 w-full">
              {canGoBack && (
                <button
                  onClick={handleBack}
                  className="bg-[#025697] text-white text-sm px-6 py-2 rounded hover:bg-[#024080]"
                >
                  Back
                </button>
              )}
              {canGoNext && (
                <button
                  onClick={handleNext}
                  className="bg-[#025697] text-white text-sm px-6 py-2 rounded hover:bg-[#024080] ml-auto"
                >
                  Next
                </button>
              )}
            </div>
          </>
        )}
      </div>
      <AlarmTypeModal
        key={modalKey}
        isOpen={isModalOpen}
        onClose={handleTypeModalClose}
        mode={selectedAlarm ? "edit" : "add"}
        alarmData={selectedAlarm}
        refreshAlarms={refreshAlarms}
      />

      <DeleteModal
        isOpen={isModalsOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        alarmData={selectedAlarm}
        onDelete={handleDelete}
        type="1"
      />
    </>
  );
}
