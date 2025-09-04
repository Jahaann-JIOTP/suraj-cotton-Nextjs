"use client";
import Link from "next/link";
import { useSelector } from "react-redux";

const Breadcrumbs = () => {
  const crumbs = useSelector((state) => state.breadcrumb.crumbs);

  if (!crumbs.length) return null;

  const { labelParts, params } = crumbs[0];

  const buildHref = (part) => {
  let query = new URLSearchParams();

  if (part === "sld") {
    if (params.area) query.set("area", params.area);
    if (params.LT_selections) query.set("LT_selections", params.LT_selections);
    return `/sld${query.toString() ? "?" + query.toString() : ""}`;
  }

  if (part.startsWith("Unit")) {
    // ✅ only keep area
    query.set("area", part);
    return `/sld?${query.toString()}`;
  }

  if (part.startsWith("LT")) {
    // ✅ keep area + LT
    if (params.area) query.set("area", params.area);
    query.set("LT_selections", part);
    return `/sld?${query.toString()}`;
  }

  if (part === "meter") {
    Object.keys(params).forEach((k) => query.set(k, params[k]));
    return `/meter?${query.toString()}`;
  }
  

  if (part === "logs") {
    Object.keys(params).forEach((k) => query.set(k, params[k]));
    return `/logs?${query.toString()}`;
  }

  if (part === "log-detail") {
    Object.keys(params).forEach((k) => query.set(k, params[k]));
    return `/log-detail?${query.toString()}`;
  }

  return "#";
};

  return (
    <nav className="flex items-center gap-2 text-sm">
      {labelParts.map((part, idx) => {
        const isLast = idx === labelParts.length - 1;

        return (
          <span key={idx} className="flex items-center gap-2">
            {isLast ? (
              <span className="font-semibold text-purple-700">{part}</span>
            ) : (
              <Link href={buildHref(part)} className="text-blue-600 hover:underline">
                {part}
              </Link>
            )}
            {idx < labelParts.length - 1 && <span>{">"}</span>}
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
