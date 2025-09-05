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

      // ❌ Do not add unit or LT here
      if (pathname.includes("/meter") || pathname.includes("/logs") || pathname.includes("/log-detail")) {
        parts.push("meter");
      }
    } else {
      // ✅ SLD flow
      parts.push("sld");

      if (params["area"]) parts.push(params["area"]); // e.g. Unit_4
      if (params["LT_selections"]) parts.push(params["LT_selections"]); // e.g. LT_2

      if (pathname.includes("/meter") || pathname.includes("/logs") || pathname.includes("/log-detail")) {
        parts.push("meter");
      }
    }

    // ✅ Add logs if pathname includes logs or log-detail
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
