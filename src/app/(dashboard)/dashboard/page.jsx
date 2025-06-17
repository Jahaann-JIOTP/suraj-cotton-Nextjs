"use client";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { initializeAuth } from "@/redux/slices/authSlice";
import TimePeriodSelector from "@/components/dashboardComponents/timePeriodSelector/TimePeriodSelector";

const Dashboard = () => {
  return (
    <div>
      <TimePeriodSelector />
    </div>
  );
};

export default Dashboard;
