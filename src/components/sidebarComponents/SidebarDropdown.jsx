"use client";
import { Tooltip } from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import { usePathname, useSearchParams } from "next/navigation";

export default function SidebarDropdown({
  item,
  isOpen,
  onClick,
  iscollapese,
}) {
  const [isClient, setIsClient] = useState(false);
  const path = usePathname();
  const searchParams = useSearchParams();

  // existing: used for /meter,/logs,/log-detail routing context
  const pageType = searchParams.get("page-type");

  // NEW: used for /daily_consumption and /alarms_details
  const typeParam = searchParams.get("type");

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="w-full flex items-center flex-col">
      <button
        onClick={onClick}
        className="group w-full flex cursor-pointer text-[13.216px] justify-between items-center p-2 hover:text-[#1A68B2] rounded-md"
        style={{ fontWeight: 500 }}
      >
        {iscollapese ? (
          isClient && (
            <Tooltip
              title={item.title}
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
                  sx: { color: "#025697" },
                },
              }}
            >
              <span>
                <item.icon className="w-4 h-4 text-black dark:text-white group-hover:text-[#1A68B2] dark:group-hover:text-[#1A68B2]" />
              </span>
            </Tooltip>
          )
        ) : (
          <span className="flex font-inter items-center justify-center gap-2">
            <item.icon className="w-4 h-4 text-black dark:text-white group-hover:text-[#1A68B2] dark:group-hover:text-[#1A68B2]" />
            {item.title}
          </span>
        )}
        <span>{isOpen ? <HiChevronUp /> : <HiChevronDown />}</span>
      </button>

      {isOpen && (
        <div
          className={`w-full flex flex-col  ${
            iscollapese
              ? "p-auto justify-center items-center px-1"
              : "pr-2 pl-4"
          } gap-2`}
        >
          {item.submenu.map((sub) => {
            const nestedArr = ["/meter", "/logs", "/log-detail"];
            let activePath = false;
            if (
              item.title === "Alarm Setup" &&
              sub.title === "Alarm Config." &&
              Array.isArray(item.matchPaths) &&
              item.matchPaths.some((base) => path.startsWith(base))
            ) {
              activePath = true;
            }
            // Parse the sub href (to read its pathname and ?type=… when present)
            const subUrl = new URL(sub.href, "http://localhost"); // base is ignored for path parsing
            const subPathname = subUrl.pathname;
            const subType = subUrl.searchParams.get("type");

            // ---- Existing rules for SLD + Field Meters + nested pages ----
            if (path.startsWith("/sld") && subPathname.startsWith("/sld")) {
              activePath = true;
            } else if (
              path.startsWith("/field-meters") &&
              subPathname.startsWith("/field-meters")
            ) {
              activePath = true;
            } else if (nestedArr.some((r) => path.startsWith(r))) {
              if (pageType === "sld" && subPathname.startsWith("/sld")) {
                activePath = true;
              } else if (
                pageType === "field-meter" &&
                subPathname.startsWith("/field-meters")
              ) {
                activePath = true;
              }
            }
            // ---- NEW rules for Daily Consumption (match pathname + type) ----
            else if (
              path.startsWith("/daily_consumption") &&
              subPathname.startsWith("/daily_consumption")
            ) {
              // If sub item has a type, require it to match; otherwise consider it active on any type
              activePath = subType ? subType === typeParam : true;
            }
            // ---- NEW rules for Alarms Details (match pathname + type) ----
            else if (
              path.startsWith("/alarms_details") &&
              subPathname.startsWith("/alarms_details")
            ) {
              activePath = subType ? subType === typeParam : true;
            }
            // ---- Fallback: exact href match (for simple links without query) ----
            else if (path === subPathname) {
              activePath = true;
            }

            return (
              <Link
                key={sub.id ?? sub.href}
                href={sub.href}
                className={`group flex hover:text-[#1A68B2] w-full py-[7px] text-[13.216px] rounded-md ${
                  iscollapese ? "items-center justify-center" : ""
                }`}
                style={{ fontWeight: 500 }}
              >
                {iscollapese ? (
                  <div className="relative flex items-center justify-center">
                    {isClient && (
                      <Tooltip
                        title={sub.title}
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
                            sx: { color: "#025697" },
                          },
                        }}
                      >
                        <span>
                          <sub.icon
                            className={`w-5 h-5 ${
                              activePath
                                ? "text-[#1A68B2]"
                                : "text-black dark:text-white"
                            } group-hover:text-[#1A68B2] dark:group-hover:text-[#1A68B2]`}
                          />
                        </span>
                      </Tooltip>
                    )}
                  </div>
                ) : (
                  <div
                    className={`text-[13px] font-inter ${
                      activePath
                        ? "text-[#1A68B2]"
                        : "text-black dark:text-white"
                    } w-full flex items-center justify-start pl-4 gap-2 group-hover:text-[#1A68B2] dark:group-hover:text-[#1A68B2]`}
                  >
                    <sub.icon
                      className={`w-5 h-5 ${
                        activePath
                          ? "text-[#1A68B2]"
                          : "text-black dark:text-white"
                      } group-hover:text-[#1A68B2] dark:group-hover:text-[#1A68B2]`}
                    />
                    {sub.title}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
