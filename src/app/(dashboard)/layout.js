"use client";

import React, { useState, useEffect } from "react";

import { usePathname, useRouter } from "next/navigation";
import TopHeader from "@/components/layout/TopHeader";
import Header from "@/components/layout/Header";
import { useDispatch, useSelector } from "react-redux";
import { initializeAuth } from "@/redux/slices/authSlice";

import Sidebar from "@/components/layout/Sidebar";
import { getActiveTabFromPathname } from "../../utils/navigation-utils";
import config from "@/constant/apiRouteList";

export default function DashboardLayout({ children }) {
  const [activeTab, setActiveTab] = useState("Home");
  const [authChecked, setAuthChecked] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const token = useSelector((state) => state.auth.token);

  // fetch use details
  const fetchUserDetails = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${config.BASE_URL}${config.USER.PROFILE}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        const privileges = data?.role?.privelleges?.map((p) => p.name) || [];
        
      } else {
        console.error("Failed to fetch user profile");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };
  useEffect(() => {
    const currentTab = getActiveTabFromPathname(pathname);
    setActiveTab(currentTab);
  }, [pathname]);

  useEffect(() => {
    fetchUserDetails();
    const checkAuth = async () => {
      await dispatch(initializeAuth());
      setAuthChecked(true);
    };
    checkAuth();
  }, [dispatch]);

  useEffect(() => {
    if (authChecked && !isAuthenticated) {
      router.replace("/");
    }
  }, [authChecked, isAuthenticated, router]);

  useEffect(() => {
    if (!token) return;

    try {
      const { exp } = JSON.parse(atob(token.split(".")[1]));
      const expiryTime = exp * 1000;
      const currentTime = Date.now();
      const timeout = setTimeout(() => {
        localStorage.removeItem("token");
        router.push("/");
      }, expiryTime - currentTime);

      return () => clearTimeout(timeout);
    } catch (err) {
      console.error("Auto-logout error:", err);
    }
  }, [token, router]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  if (!isAuthenticated) return null;

  return (
    <div
      className={` flex flex-col bg-[#f7f7f7] dark:bg-gray-900 overflow-hidden`}
    >
      <TopHeader />
      <Header handleTabClick={handleTabClick} />

      <div className="flex px-4 gap-[0.7vw]">
        <Sidebar activeTab={activeTab} handleTabClick={handleTabClick} />
        <main
          // className="w-full h-full pb-5 md:p-auto md:h-[81vh] overflow-x-hidden overflow-y-auto bg-center bg-contain bg-no-repeat"
          className="w-full h-full pb-5 md:p-auto md:h-[81vh] overflow-hidden bg-center bg-contain bg-no-repeat"
          style={{ backgroundImage: 'url("./bglogo.png")' }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
