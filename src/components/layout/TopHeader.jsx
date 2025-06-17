"use client";
import { useTheme } from "next-themes";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const TopHeader = () => {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return (
    <header className="h-[48px] flex items-center justify-between px-4 bg-white dark:bg-gray-800">
      <Link href={"/dashboard"} className="flex items-center">
        {theme === "light" ? (
          <img src="./suraj-cotton-logo.png" className="h-14" alt="Logo" />
        ) : (
          <img
            src="./suraj-cotton-login-logo.png"
            className="h-14"
            alt="Logo"
          />
        )}
      </Link>

      <div className="header-right flex items-center space-x-4">
        {theme === "light" ? (
          <img
            src={"./jahaann-light.svg"}
            alt="User Image"
            className={`h-[30px]`}
          />
        ) : (
          <img
            src={"./jahaann-dark.png"}
            alt="User Image"
            className={`h-[30px]`}
          />
        )}
      </div>
    </header>
  );
};

export default TopHeader;
