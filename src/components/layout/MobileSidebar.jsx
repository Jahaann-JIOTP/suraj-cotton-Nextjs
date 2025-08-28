"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { IoLogOut } from "react-icons/io5";

import {
  privilegeConfig,
  sidebarLinksMap,
  privilegeOrder,
} from "@/constant/navigation";

export default function MobileSidebar({ userPrivileges, closeSidebar }) {
  const [openTab, setOpenTab] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const dispatch = useDispatch();
  const router = useRouter();

  // ref for detecting outside click
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        closeSidebar();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeSidebar]);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  const toggleTab = (tab) => {
    setOpenTab(openTab === tab ? null : tab);
    setOpenDropdown(null);
  };

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  return (
    <div
      ref={sidebarRef}
      className="fixed top-[92px] left-0 h-[86vh] md:h-[86vh] bg-white dark:bg-gray-800 text-black dark:text-white shadow-lg z-50 w-full md:w-1/2 lg:w-1/5 flex flex-col"
    >
      <div className="flex-1 overflow-y-auto scrollbar-hide p-4">
        {privilegeOrder
          .filter((key) => userPrivileges.includes(key))
          .map((privilegeKey) => {
            const config = privilegeConfig[privilegeKey];
            if (!config) return null;
            return (
              <div key={privilegeKey}>
                <button
                  className="w-full flex cursor-pointer justify-between items-center font-bold py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                  onClick={() => toggleTab(config.tab)}
                >
                  <div
                    className="flex items-center gap-2 text-[15px]"
                    style={{ fontWeight: 500 }}
                  >
                    {config.icon && typeof config.icon !== "string" && (
                      <FontAwesomeIcon icon={config.icon} />
                    )}
                    <span>{config.label}</span>
                  </div>
                  <span className="text-sm">
                    {openTab === config.tab ? (
                      <HiChevronUp />
                    ) : (
                      <HiChevronDown />
                    )}
                  </span>
                </button>

                {openTab === config.tab && sidebarLinksMap[config.tab] && (
                  <div className="pl-4 pr-1">
                    {sidebarLinksMap[config.tab].map((item, idx) => (
                      <div key={idx}>
                        {item.submenu ? (
                          <div>
                            <button
                              onClick={() => toggleDropdown(idx)}
                              className="w-full flex cursor-pointer justify-between items-center py-2 px-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                            >
                              <div className="flex items-center gap-2">
                                <item.icon className="w-5" />
                                <span
                                  className="text-[14px]"
                                  style={{ fontWeight: 500 }}
                                >
                                  {item.title}
                                </span>
                              </div>
                              <span>
                                {openDropdown === idx ? (
                                  <HiChevronUp />
                                ) : (
                                  <HiChevronDown />
                                )}
                              </span>
                            </button>
                            {openDropdown === idx && (
                              <div className="ml-4">
                                {item.submenu.map((sub) => (
                                  <Link
                                    key={sub.id}
                                    href={sub.href}
                                    onClick={closeSidebar}
                                  >
                                    <div className="flex items-center gap-2 py-1 px-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                                      {sub.icon &&
                                        typeof sub.icon !== "string" && (
                                          <sub.icon className="w-4 h-4" />
                                        )}
                                      <span>{sub.title}</span>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <Link href={item.href} onClick={closeSidebar}>
                            <div className="flex items-center gap-2 py-1 px-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                              <item.icon />
                              {item.label || item.title}
                            </div>
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
      </div>

      <div className="w-full px-4 py-4">
        <button
          onClick={handleLogout}
          className="w-full py-3 bg-[#1A68B2] text-[16.004px] flex items-center justify-center gap-2 cursor-pointer rounded-md"
          style={{ fontWeight: 600 }}
        >
          <IoLogOut size={28} className="text-white" />
          <span className="text-white">Logout</span>
        </button>
      </div>
    </div>
  );
}
