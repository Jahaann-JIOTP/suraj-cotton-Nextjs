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
    let parts = [];
    // ✅ Always start with "home"
    parts.push("home");
    
    const isFieldMeter = params["page-type"] === "field-meter";

    if (isFieldMeter) {
      // ✅ Field-meters flow
      parts.push("field-meters");
      if (
        pathname.includes("/meter") ||
        pathname.includes("/logs") ||
        pathname.includes("/log-detail")
      ) {
        parts.push("meter");
      }
    } else {
      // ✅ SLD flow
      parts.push("sld");

      if (params["area"]) parts.push(params["area"]); // e.g. Unit_4
      
      // ✅ Only push LT when area is NOT ht/hfo
      if (
        params["LT_selections"] &&
        params["area"] !== "ht" &&
        params["area"] !== "hfo"
      ) {
        parts.push(params["LT_selections"]);
      }
      
      if (
        pathname.includes("/meter") ||
        pathname.includes("/logs") ||
        pathname.includes("/log-detail")
      ) {
        parts.push("meter");
      }
    }


    if (pathname.includes("/logs") || pathname.includes("/log-detail")) {
      parts.push("logs");
    }

    // ✅ log-detail always last
    if (pathname.includes("/log-detail")) {
      parts.push("log-detail");
    }

    dispatch(addCrumb({ labelParts: parts, params }));
  }, [pathname, searchParams, dispatch]);
}
