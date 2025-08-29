"use client";
import { useState, useRef, useEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { useTheme } from "next-themes";
import { MdOutlineFullscreen, MdOutlineFullscreenExit } from "react-icons/md";
import config from "@/constant/apiRouteList";
import CustomLoader from "@/components/customLoader/CustomLoader";

const EnergyComparison = () => {
  const today = new Date().toISOString().split("T")[0];
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [isEnergyComparisonFullView, setEnergyComparisonFullView] =
    useState(false);
  const { theme } = useTheme();
  const chartDivRef = useRef(null);
  const rootRef = useRef(null);

  const handleEnergyComparisonFullView = () => {
    setEnergyComparisonFullView((prev) => !prev);
  };

  const [pieChartData, setPieChartData] = useState([]);
  const colorMap = {
    "Solar Generation": "#63F4B7",
    "LT Generation": "#FF714E",
    "HT Generation": "#F8B257",
    "WAPDA Import": "#1261a0",
  };

  const meterNameMap = {
    // U19_PLC_Del_ActiveEnergy: "Diesel IC",
    // U11_GW01_Del_ActiveEnergy: "Gas LT Panel",
    // U6_GW02_Del_ActiveEnergy: "Solar",
    // U17_GW03_Del_ActiveEnergy: "Solar 2",
    // U13_GW02_ActiveEnergy_Imp_kWh: "Transformer 1 LT-1 ACB",
    // U16_GW03_ActiveEnergy_Imp_kWh: "Transformer 2 LT-2 ACB",
    // U23_GW01_Del_ActiveEnergy: "Wapda 1 Incoming",
    // U22_GW01_Del_ActiveEnergy: "HFO Incomming",
    // U20_GW03_Del_ActiveEnergy: "T/F 3",
    // U19_GW03_Del_ActiveEnergy: "Wapda + HFO + Gas Incomming",


    U19_PLC_Del_ActiveEnergy:"Diesel + Gas Incoming",
    U11_GW01_Del_ActiveEnergy:"Gas LT Panel",
    U6_GW02_Del_ActiveEnergy:"Solar 1",
    U17_GW03_Del_ActiveEnergy:"Solar 2",
    U22_GW01_ActiveEnergy_Imp_kWh:"HFO Incoming",
    U27_PLC_ActiveEnergy_Imp_kWh:"Wapda 2",
    U22_PLC_Del_ActiveEnergy: "HFO/1",
    U26_PLC_Del_ActiveEnergy:"I-GG",
  };

  const fetchPieChartData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch(
        `${config.BASE_URL}${config.DASHBOARD.GET_ENERGY_COMPARISON}?start_date=${startDate}&end_date=${endDate}&Label=Custom`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const resResult = await response.json();

        const transformedData = resResult.map((item) => ({
          category: item.category,
          value: item.total,
          subData: item.subData.map((sub) => ({
            category: meterNameMap[sub.name] || sub.name,
            value: sub.value,
          })),
        }));
        setPieChartData(transformedData);
        setLoading(false);
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPieChartData();
  }, [startDate, endDate]);

  useEffect(() => {
    if (!chartDivRef.current || pieChartData.length === 0) return;

    if (rootRef.current) {
      rootRef.current.dispose();
      rootRef.current = null;
    }

    const root = am5.Root.new(chartDivRef.current);
    rootRef.current = root;

    root._logo?.dispose();
    root.setThemes([am5themes_Animated.new(root)]);

    if (theme === "dark") {
      root.interfaceColors.set("text", am5.color(0xffffff));
      root.interfaceColors.set("grid", am5.color(0x444444));
      root.interfaceColors.set("background", am5.color(0x1e1e1e));
    } else {
      root.interfaceColors.set("text", am5.color(0x000000));
      root.interfaceColors.set("grid", am5.color(0xcccccc));
      root.interfaceColors.set("background", am5.color(0xffffff));
    }
    const tooltip = am5.Tooltip.new(root, {
      labelText: "[fontSize: 12px]{category}: {value} kWh",
    });

    const container = root.container.children.push(
      am5.Container.new(root, {
        width: am5.p100,
        height: am5.p100,
        layout: root.horizontalLayout,
        paddingTop: 0,
        paddingBottom: 20,
        paddingLeft: 50,
        paddingRight: 0,
      })
    );

    // Main Pie Chart
    const chart = container.children.push(
      am5percent.PieChart.new(root, {
        tooltip: tooltip, // Use the custom tooltip
      })
    );

    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category",
        alignLabels: true,
      })
    );

    series.slices.template.adapters.add("fill", (fill, target) => {
      const category = target.dataItem?.dataContext?.category;
      return am5.color(colorMap[category] || "#cccccc");
    });

    series.labels.template.setAll({
      text: "{category}: {value} kWh",
      radius: 10,
      inside: false,
      fontSize: "[fontSize: 8px]",
    });

    series.ticks.template.set("visible", false);

    series.slices.template.set("toggleKey", "none");

    // Sub Pie Chart
    const subChart = container.children.push(
      am5percent.PieChart.new(root, {
        radius: am5.percent(70),
        tooltip: tooltip, // Use the same custom tooltip
      })
    );

    const subSeries = subChart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category",
      })
    );

    // ✅ Hide labels and ticks on sub pie chart
    subSeries.labels.template.setAll({
      visible: false,
    });
    subSeries.slices.template.setAll({
      toggleKey: "none",
      interactive: true, // ✅ enable hover interactions
    });

    subSeries.slices.template.states.create("hover", {
      scale: 1.05, // ✅ subtle hover zoom
    });

    subSeries.ticks.template.setAll({
      visible: false,
    });

    // ✅ SubChart Legend at bottom center horizontally
    const legend = root.container.children.push(
      am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
        y: am5.percent(90),
        layout: root.horizontalLayout,
        marginTop: 0,
      })
    );

    legend.labels.template.setAll({
      fontSize: 10,
      fontWeight: "500",
    });
    legend.markers.template.setAll({
      width: 10,
      height: 10,
      marginRight: 2,
    });

    // Add this to hide the values in legend
    legend.valueLabels.template.set("forceHidden", true);

    let selectedSlice;

    const line0 = container.children.push(
      am5.Line.new(root, {
        position: "absolute",
        stroke: root.interfaceColors.get("text"),
        strokeDasharray: [5, 5],
      })
    );

    const line1 = container.children.push(
      am5.Line.new(root, {
        position: "absolute",
        stroke: root.interfaceColors.get("text"),
        strokeDasharray: [5, 5],
      })
    );

    function updateLines() {
      if (selectedSlice) {
        const startAngle = selectedSlice.get("startAngle");
        const arc = selectedSlice.get("arc");
        const radius = selectedSlice.get("radius");

        const x00 = radius * am5.math.cos(startAngle);
        const y00 = radius * am5.math.sin(startAngle);
        const x10 = radius * am5.math.cos(startAngle + arc);
        const y10 = radius * am5.math.sin(startAngle + arc);

        const subRadius = subSeries.slices.getIndex(0)?.get("radius") || 0;

        const point00 = series.toGlobal({ x: x00, y: y00 });
        const point10 = series.toGlobal({ x: x10, y: y10 });
        const point01 = subSeries.toGlobal({ x: 0, y: -subRadius });
        const point11 = subSeries.toGlobal({ x: 0, y: subRadius });

        line0.set("points", [point00, point01]);
        line1.set("points", [point10, point11]);
      }
    }

    function selectSlice(slice) {
      selectedSlice = slice;
      const dataContext = slice.dataItem?.dataContext;
      const category = dataContext?.category;

      if (dataContext) {
        const baseColor = am5.color(colorMap[category] || "#cccccc");
        const subData = dataContext.subData.map((d, i) => ({
          ...d,
          fill: am5.Color.brighten(baseColor, i * 2),
        }));

        subSeries.data.setAll(subData);
        legend.data.setAll(subSeries.dataItems);

        legend.labels.template.adapters.add("text", (text, target) => {
          return target.dataItem?.dataContext?.category || "";
        });

        // ✅ Set sub-pie slice colors from computed shades
        subSeries.slices.each((slice, index) => {
          const fillColor = subData[index]?.fill;
          if (fillColor) {
            slice.set("fill", fillColor);
            slice.set("stroke", am5.color(fillColor));
            slice.set("strokeWidth", 1);
          }
        });
      }

      const middleAngle = slice.get("startAngle") + slice.get("arc") / 2;
      const firstAngle = series.dataItems[0].get("slice").get("startAngle");

      series.animate({
        key: "startAngle",
        to: firstAngle - middleAngle,
        duration: 1000,
        easing: am5.ease.out(am5.ease.cubic),
      });

      series.animate({
        key: "endAngle",
        to: firstAngle - middleAngle + 360,
        duration: 1000,
        easing: am5.ease.out(am5.ease.cubic),
      });

      updateLines();
    }

    // subSeries.slices.template.set("tooltipText", ""); // close tooltip for subpie chart

    series.slices.template.events.on("click", (e) => {
      selectSlice(e.target);
    });

    series.on("startAngle", updateLines);

    container.events.on("boundschanged", () => {
      root.events.once("frameended", updateLines);
    });

    series.data.setAll(pieChartData);

    series.events.on("datavalidated", () => {
      const defaultSliceIndex = pieChartData.findIndex((item) =>
        // item.category.includes("HT") || item.category.includes("Generation")
        item.category.includes("Solar")
      );
      selectSlice(
        series.slices.getIndex(defaultSliceIndex >= 0 ? defaultSliceIndex : 0)
      );
    });

    container.appear(1000, 10);

    return () => {
      root.dispose();
    };
  }, [theme, isEnergyComparisonFullView, pieChartData]);

  // Update the fetch function to use the selected dates
  const handleDateChange = () => {
    if (startDate && endDate) {
      fetchPieChartData();
    }
  };

  useEffect(() => {
    handleDateChange();
  }, [startDate, endDate]);

  return (
    <div
      className={`${
        isEnergyComparisonFullView
          ? "fixed inset-0 z-50  p-5 overflow-auto w-[100%] m-auto h-[100vh]"
          : "relative  px-1 py-2 md:p-3 h-[17rem] md:h-[15rem] lg:h-[16.5rem] xl:h-[14.3rem]"
      } border-t-3 border-[#1F5897] bg-white dark:bg-gray-700 rounded-md shadow-md `}
    >
      {/* Header */}
      <div className="relative flex items-start md:items-center flex-col md:flex-row gap-3 md:gap-auto justify-between">
        <span className="text-[15px] text-[#1A68B2] .font-raleway font-600">
          Energy Comparison
        </span>
        <div className=" flex items-center justify-center gap-2">
          <div className="flex items-start flex-col md:flex-row justify-start gap-1">
            <span className="text-[12px] font-raleway font-semibold text-black dark:text-white">
              Select Interval
            </span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="text-[12px] font-raleway px-1 py-0.5 border rounded"
            />
          </div>
          <div className="flex items-start justify-start flex-col md:flex-row gap-1">
            <span className="text-[12px] font-raleway font-semibold text-black dark:text-white">
              to
            </span>
            <input
              type="date"
              value={endDate}
              min={startDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="text-[12px] font-raleway px-1 py-0.5 border rounded"
            />
          </div>
          <button
            className="absolute top-0 right-[0px] md:relative cursor-pointer"
            onClick={handleEnergyComparisonFullView}
          >
            {isEnergyComparisonFullView ? (
              <MdOutlineFullscreenExit size={20} />
            ) : (
              <MdOutlineFullscreen size={20} />
            )}
          </button>
        </div>
      </div>

      {/* {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-700/50 rounded-md z-10">
          <CustomLoader />
        </div>
      )} */}
      {/* Chart */}
      <div
        className={`flex justify-end ${
          isEnergyComparisonFullView
            ? "h-[90%] flex items-center justify-center"
            : "md:h-[11.7rem]"
        } relative`}
      >
        <div
          ref={chartDivRef}
          className={`w-full ${
            isEnergyComparisonFullView ? "h-[70%]" : "h-[10.8rem]"
          }  right-0`}
        />
      </div>
    </div>
  );
};

export default EnergyComparison;
