"use client";
import Link from "next/link";
import { useSelector } from "react-redux";
import { FaHome } from "react-icons/fa";
import { IoChevronForward } from "react-icons/io5";

const Breadcrumbs = () => {
  const crumbs = useSelector((state) => state.breadcrumb.crumbs);

  if (!crumbs.length) return null;

  const { labelParts, params } = crumbs[0];

  const buildHref = (part) => {
    let query = new URLSearchParams();

    if (part === "home") {
      return "/dashboard";
    }

    if (part === "sld") {
      if (params.area) query.set("area", params.area);
      if (params.LT_selections)
        query.set("LT_selections", params.LT_selections);
      return `/sld`;
    }

    if (part === "field-meters") {
      return "/field-meters";
    }

    if (part.startsWith("Unit")) {
      query.set("area", part);
      return `/sld?${query.toString()}`;
    }

    if (part.startsWith("LT")) {
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

  const getDisplayLabel = (part) => {
    if (part === "home") return <FaHome />;
    if (part === "field-meters") return "field-meters";
    if (part === "LT_3") return "LT 1";
    if (part === "LT_4") return "LT 2";
    return part.replace(/_/g, " ");
  };

  return (
    <nav className="flex items-center gap-2 text-[18px]">
      {labelParts.map((part, idx) => {
        const isLast = idx === labelParts.length - 1;
console.log(buildHref(part))
        return (
          <span key={idx} className="flex capitalize items-center gap-2">
            {isLast ? (
              <span className="font-semibold text-[#1D5999]">
                {getDisplayLabel(part)}
              </span>
            ) : (
              <Link
                href={buildHref(part)}
                className="text-gray-400 hover:text-[#1D5999] hover:underline flex items-center gap-1"
              >
                {getDisplayLabel(part)}
              </Link>
            )}
            {idx < labelParts.length - 1 && <span className="text-gray-400"><IoChevronForward /></span>}
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
