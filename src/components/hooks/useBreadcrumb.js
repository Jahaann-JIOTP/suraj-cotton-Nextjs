"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addCrumb } from "@/redux/slices/breadcrumbSlice";

export default function useBreadcrumb() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    const url = `${pathname}${searchParams.toString() ? "?" + searchParams.toString() : ""}`;

    let parts = [];

    // Always start with sld
    parts.push("sld");

    // ✅ Add unit if present
    if (params["area"]) parts.push(params["area"]); // e.g. Unit_5

    // ✅ Add LT selection if present
    if (params["LT_selections"]) parts.push(params["LT_selections"]); // e.g. LT_3

    // ✅ Add meter if we detect meter_id or pathname contains /meter
    if (params["meter_id"] || pathname.includes("meter")) {
      parts.push("meter");
    }

    // ✅ Add logs if query indicates log context OR pathname contains /logs
    if (params["type"] || params["page-type"] || pathname.includes("logs")) {
      parts.push("logs");
    }

    // ✅ log-detail always if in pathname
    if (pathname.includes("log-detail")) {
      parts.push("log-detail");
    }

    dispatch(addCrumb({ labelParts: parts, params }));
  }, [pathname, searchParams, dispatch]);
}
