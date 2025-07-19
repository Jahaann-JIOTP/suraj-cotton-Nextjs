"use client";
import React from "react";
import { toast } from "react-toastify";

const ColorPage = () => {
  const colors = [
    "#012aff",
    "#0132ff",
    "#013aff",
    "#0243ff",
    "#024bff",
    "#0253ff",
    "#025bff",
    "#0263fe",
    "#026cfe",
    "#0374fe",
    "#037cfe",
    "#0384fe",
    "#038dfe",
    "#0395fe",
    "#039dfe",
    "#04a5fe",
    "#04adfe",
    "#04b6fe",
    "#04befe",
    "#04c6fd",
    "#04cefd",
    "#05d6fd",
    "#05dffd",
    "#05e7fd",
    "#05effd",
    "#05effd",
    "#05f0f3",
    "#06f0e8",
    "#06f1de",
    "#06f2d3",
    "#06f2c9",
    "#07f3be",
    "#07f4b4",
    "#07f4a9",
    "#07f59f",
    "#08f694",
    "#08f68a",
    "#08f77f",
    "#08f875",
    "#09f86a",
    "#09f960",
    "#09fa55",
    "#09fa4b",
    "#0afb40",
    "#0afc36",
    "#0afc2b",
    "#0afd21",
    "#0bfe16",
    "#0bfe0c",
    "#0bff01",
    "#0bff01",
    "#15ff01",
    "#1fff01",
    "#29ff01",
    "#33ff01",
    "#3dff01",
    "#48ff01",
    "#52ff01",
    "#5cff01",
    "#66ff01",
    "#70ff01",
    "#7aff01",
    "#84ff01",
    "#8eff00",
    "#98ff00",
    "#a2ff00",
    "#acff00",
    "#b6ff00",
    "#c1ff00",
    "#cbff00",
    "#d5ff00",
    "#dfff00",
    "#e9ff00",
    "#f3ff00",
    "#fdff00",
    "#fdff00",
    "#fdf500",
    "#fdea00",
    "#fde000",
    "#fdd601",
    "#fdcc01",
    "#fdc101",
    "#fdb701",
    "#fdad01",
    "#fda201",
    "#fd9801",
    "#fd8e01",
    "#fe8402",
    "#fe7902",
    "#fe6f02",
    "#fe6502",
    "#fe5a02",
    "#fe5002",
    "#fe4602",
    "#fe3b02",
    "#fe3103",
    "#fe2703",
    "#fe1d03",
    "#fe1203",
    "#fe0803",
  ];
  function copyToClipboard(text) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Content copied to clipboard successfully!");
      })
      .catch((err) => {
        toast.error("Failed to copy content to clipboard:", err);
      });
  }
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {colors.map((color) => (
        <button
          className="w-[100px] h-[20px] cursor-pointer"
          onClick={() => copyToClipboard(color)}
          style={{ background: color }}
        ></button>
      ))}
    </div>
  );
};

export default ColorPage;
