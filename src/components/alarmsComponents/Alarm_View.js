import { useState } from 'react';

export default function ViewDetailsModal({ isOpen, onClose, alarmData }) {
    if (!isOpen) return null;

    // Handle cases where alarmData is null or undefined
    const location = alarmData?.location ?? 'Unit 4';
    const subLocation = alarmData?.subLocation ?? 'LT1';
    const device = alarmData?.device ?? 'Turbine';
    const name = alarmData?.name ?? 'Device Settings';
    const parameter = alarmData?.parameter ?? 'Current';
    const acknowledgement = alarmData?.acknowledgement ?? 'Single Acknowledgement';
    const state = alarmData?.state ?? 'Inactive';

    return (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.45)] backdrop-blur-[1px] flex items-center justify-center mt-1 z-50">
            <div className="bg-white dark:bg-gray-700 h-[80vh] mt-[9%] dark:border-gray-600 !border !border-t-4 !border-t-[#1d5999] border-black/10 dark:border-white/10 rounded-[10px] w-full max-w-[100%] !overflow-auto custom-scrollbar relative">
                <div className="flex justify-end p-4 !pb-0">
                    <button
                        onClick={onClose}
                        className="cursor-pointer bg-[#025697] dark:bg-[#024080] text-white px-4 py-2 rounded hover:bg-[#024080] transition duration-300"
                    >
                        Close
                    </button>
                </div>
                <div className="flex justify-center px-6">
                    <div className="px-1 py-1 rounded-[5.544px] shadow-[0_0_24px_-1px_rgba(0,0,0,0.19)] bg-white dark:bg-gray-600 text-white dark:text-white hover:bg-[#024080] transition duration-300">
                        <button className="!font-[Inter] px-6 py-2 w-[150px] rounded-[5.544px] border-[0.317px] border-[rgba(0,_0,_0,_0.10)] bg-[#025697] dark:bg-[#024080] text-white hover:bg-[#024080] transition duration-300">
                            Details
                        </button>
                    </div>
                </div>

                <div className="px-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Where Section */}
                        <div className="flex flex-col">
                            <h4 className="text-[#025697] dark:text-white text-[20px] font-bold mb-4 border-b-1 !font-[Inter] border-b border-[rgba(0,0,0,0.06)]">Where</h4>
                            <div className="gap-4 text-[#17282FCF] dark:text-white">
                                <div className="grid grid-cols-2 gap-1 mt-5">
                                    <div className="flex items-center">
                                        <p className="text-[#6D6D6D] dark:text-gray-400 !font-[Inter] w-[50%]">Location:</p>
                                        <span className="font-semibold !font-[Inter]">{location}</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-1 mt-5">
                                    <div className="flex items-center">
                                        <p className="text-[#6D6D6D] dark:text-gray-400 !font-[Inter] w-[50%]">Sub Location:</p>
                                        <span className="font-semibold !font-[Inter]">{subLocation}</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-1 mt-5">
                                    <div className="flex items-center">
                                        <p className="text-[#6D6D6D] dark:text-gray-400 !font-[Inter] w-[50%]">Device:</p>
                                        <span className="font-semibold !font-[Inter]">{device}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* What Section */}
                        <div className="flex flex-col">
                            <h4 className="text-[#025697] dark:text-white text-[20px] font-bold mb-4 border-b-1 !font-[Inter] border-b border-[rgba(0,0,0,0.06)]">What</h4>
                            <div className="gap-4 text-[#17282FCF] dark:text-white">
                                <div className="grid grid-cols-2 gap-1 mt-5">
                                    <div className="flex items-center">
                                        <p className="text-[#6D6D6D] dark:text-gray-400 !font-[Inter] w-[50%]">Name:</p>
                                        <span className="font-semibold !font-[Inter]">{name}</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-1 mt-5">
                                    <div className="flex items-center">
                                        <p className="text-[#6D6D6D] dark:text-gray-400 !font-[Inter] w-[50%]">Parameter:</p>
                                        <span className="font-semibold !font-[Inter]">{parameter}</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-1 mt-5">
                                    <div className="flex items-center">
                                        <p className="text-[#6D6D6D] dark:text-gray-400 !font-[Inter] w-[50%]">Acknowledgement Type:</p>
                                        <span className="font-semibold !font-[Inter]">{acknowledgement}</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-1 mt-5">
                                    <div className="flex items-center">
                                        <p className="text-[#6D6D6D] dark:text-gray-400 !font-[Inter] w-[50%]">State:</p>
                                        <span className="font-semibold !font-[Inter]">{state}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>


    );
}
