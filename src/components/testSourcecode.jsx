"use client";
import React, { useState, useEffect, useRef } from "react";
import Div from "@/components/Div";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import { Sunrise, Sunset, Sun } from 'lucide-react';
// import { CloudSun } from 'lucide-react'; // Partly cloudy icon
import { MapPin } from "lucide-react";
// import { WiDaySunny } from 'react-icons/wi';
import {
  WiDaySunny,
  WiRain,
  WiDayCloudy,
  WiCloud,
  WiFog,
  WiThunderstorm,
  WiSnow,
  WiSprinkle,
  WiNa,
} from "react-icons/wi";

function DashboardPage() {
  const [energyLoading4, setenergyLoading4] = useState(false);
  const [energyError4, setenergyError4] = useState(null);
  const [loading1, setLoading1] = useState(false);
  const [error1, setError1] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [expandedCards, setExpandedCards] = useState({
    airConsumption1: false,
  });
  const [selectedCategory, setSelectedCategory] = useState("Solar Generation");
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("week");
  const [loading2, setLoading2] = useState(false);
  const [error2, setError2] = useState(null);
  const [allproductionValue, setAllproductionValue] = useState(null); // Added state for consumption value

  const [expanded, setExpanded] = useState(false);
  const WeatherCard = ({
    icon,
    label,
    temp,
    color = "blue",
    precipitation,
  }) => (
    <div className="mt-[-18px] flex items-center justify-between p-4 rounded-lg shadow-md custom-weather-condition ">
      <div className="flex items-center space-x-3">
        <span className={`text-5xl text-${color}-600`}>{icon}</span>
        <p className={`font-semibold text-3xl text-${color}-600`}>{label}</p>
      </div>
      <div className="text-center">
        <p className={`text-4xl text-blue-600`}>{temp}°C</p>
        {precipitation !== undefined && (
          <>
            {/* <hr className="my-2 border-t-2 border-gray-300 mt-10" /> */}
            <p className="text-lg text-gray-600">{precipitation} mm</p>
          </>
        )}
      </div>
    </div>
  );

  const toggleExpand = (card) => {
    setExpandedCards((prev) => ({
      ...prev,
      [card]: !prev[card],
    }));
  };

  useEffect(() => {
    fetchChartData1(selectedPeriod);
  }, [selectedPeriod]);

  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    // Fetching weather data
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=31.5497&longitude=73.11076&current_weather=true&daily=sunrise,sunset,temperature_2m_min,temperature_2m_max,precipitation_sum,shortwave_radiation_sum&timezone=auto"
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("Weather Data:", data);
        setWeather(data);
      })
      .catch((err) => console.error("Error fetching weather data:", err));
  }, []);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };
  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 1))
      .toISOString()
      .split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timePeriod, setTimePeriod] = useState("hourly"); // Track the selected time period (hourly, daily, monthly)

  const solarPieChartRef = useRef(null);
  const transformerPieChartRef = useRef(null);
  const solarsVsTransformersChartRef = useRef(null);
  const productionChartRef = useRef(null);
  const [dateRange, setDateRange] = useState([
    new Date(new Date().setDate(new Date().getDate() - 1)), // Start date default to today
    new Date(), // End date default to today
  ]);
  const [startDate1, endDate1] = dateRange;

  const [solarStartDate, setSolarStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 0))
      .toISOString()
      .split("T")[0]
  );
  const [solarEndDate, setSolarEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [transformerStartDate, setTransformerStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 0))
      .toISOString()
      .split("T")[0]
  );
  const [transformerEndDate, setTransformerEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [transformer1StartDate, setTransformer1StartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 0))
      .toISOString()
      .split("T")[0]
  );
  const [transformer1EndDate, setTransformer1EndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [All_GensetStartDate, setAll_GensetStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 0))
      .toISOString()
      .split("T")[0]
  );
  const [All_GensetEndDate, setAll_GensetEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [All_ConsumptionStartDate, setAll_ConsumptionStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [All_ConsumptionEndDate, setAll_ConsumptionEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [All_energyStartDate, setAll_energyStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [All_productionEndDate, setAll_productionEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [All_productionStartDate, setAll_productionStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [All_energyEndDate, setAll_energyEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [solarValue, setSolarValue] = useState(null);
  const [transformerValue, setTransformerValue] = useState(null);
  const [transformer1Value, setTransformer1Value] = useState(null);
  const [All_GensetValue, setAll_GensetValue] = useState(null);
  const [All_ConsumptionValue, setAll_ConsumptionValue] = useState(null);
  const [All_energyValue, setAll_energyValue] = useState(null);
  const [All_productionValue, setAll_productionValue] = useState(null);

  const calculateDateRange = (range) => {
    const today = new Date();
    let start = new Date();
    let end = new Date();

    switch (range) {
      case "today":
        start = today;
        end = today;
        // console.log(start, end);
        break;
      case "yesterday":
        start = new Date(today.setDate(today.getDate() - 1));
        end = start;
        // console.log(start, end)
        break;
      case "this_week":
        start = new Date(today.setDate(today.getDate() - today.getDay()));
        end = new Date();
        // console.log(start, end);
        break;
      case "last_week":
        start = new Date(today.setDate(today.getDate() - today.getDay() - 7));
        end = new Date(today.setDate(start.getDate() + 6));
        // console.log(start, end);
        break;
      case "this_month":
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = today;
        // console.log(start, end);
        break;
      case "last_month":
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        // console.log(start, end);
        break;
      case "this_year":
        start = new Date(today.getFullYear(), 0, 1);
        end = today;
        // console.log(start, end);
        break;
      default:
        break;
    }

    return {
      startDate0: start.toISOString().split("T")[0],
      endDate0: end.toISOString().split("T")[0],
    };
  };

  const [selectedDate, setSelectedDate] = useState("today");

  const handleDropdownChange = (event) => {
    setSelectedDate(event.target.value);
    handleSolarDropdownChange(event);
    handleTransformerDropdownChange(event);
    handleTransformer1DropdownChange(event);
    handleAll_GensetDropdownChange(event);
    handleAll_ConsumptionDropdownChange(event);
    handleAll_productionDropdownChange(event);
    handleAll_UnaccountableEnergyDropdownChange(event);
  };
  // console.log(startDate0, endDate0);
  const handleSolarDropdownChange = (e) => {
    const { startDate0, endDate0 } = calculateDateRange(e.target.value);
    console.log(startDate0, endDate0);
    setSolarStartDate(startDate0);
    setSolarEndDate(endDate0);
  };

  const handleTransformerDropdownChange = (e) => {
    const { startDate0, endDate0 } = calculateDateRange(e.target.value);
    console.log(startDate0, endDate0);
    setTransformerStartDate(startDate0);
    setTransformerEndDate(endDate0);
  };

  const handleTransformer1DropdownChange = (e) => {
    const { startDate0, endDate0 } = calculateDateRange(e.target.value);
    console.log(startDate0, endDate0);
    setTransformer1StartDate(startDate0);
    setTransformer1EndDate(endDate0);
  };

  const handleAll_GensetDropdownChange = (e) => {
    const { startDate0, endDate0 } = calculateDateRange(e.target.value);
    console.log(startDate0, endDate0);
    setAll_GensetStartDate(startDate0);
    setAll_GensetEndDate(endDate0);
  };

  const handleAll_ConsumptionDropdownChange = (e) => {
    const { startDate0, endDate0 } = calculateDateRange(e.target.value);
    setAll_ConsumptionStartDate(startDate0);
    setAll_ConsumptionEndDate(endDate0);
  };

  const handleAll_productionDropdownChange = (e) => {
    const { startDate0, endDate0 } = calculateDateRange(e.target.value);
    setAll_productionStartDate(startDate0);
    setAll_productionEndDate(endDate0);
  };

  const handleAll_UnaccountableEnergyDropdownChange = (e) => {
    const { startDate0, endDate0 } = calculateDateRange(e.target.value);
    console.log(startDate0, endDate0);
    setAll_energyStartDate(startDate0);
    setAll_energyEndDate(endDate0);
  };

  useEffect(() => {
    const fetchSolarData = () => {
      const apiUrl = `https://gclapi.jiotp.com//solar_vs_trans.php?start_date=${solarStartDate}&end_date=${solarEndDate}`;
      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          if (data && data.total_consumption) {
            setSolarValue(data.total_consumption.Solars);
          }
        })
        .catch((error) => {
          console.error("Error fetching Solars data:", error);
        });
    };

    fetchSolarData(); // Initial fetch
    const interval = setInterval(fetchSolarData, 60000); // Fetch every 1 minute

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [solarStartDate, solarEndDate]);

  useEffect(() => {
    const fetchTransformerData = () => {
      const apiUrl = `https://gclapi.jiotp.com//solar_vs_trans.php?start_date=${transformerStartDate}&end_date=${transformerEndDate}`;
      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          if (data && data.total_consumption) {
            setTransformerValue(data.total_consumption.Transformers_Import);
          }
        })
        .catch((error) => {
          console.error("Error fetching Transformers data:", error);
        });
    };

    fetchTransformerData(); // Initial fetch
    const interval = setInterval(fetchTransformerData, 60000); // Fetch every 1 minute

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [transformerStartDate, transformerEndDate]);

  useEffect(() => {
    const fetchTransformer1Data = () => {
      const apiUrl = `https://gclapi.jiotp.com//solar_vs_trans.php?start_date=${transformer1StartDate}&end_date=${transformer1EndDate}`;
      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          if (data && data.total_consumption) {
            setTransformer1Value(data.total_consumption.Transformers_Export);
          }
        })
        .catch((error) => {
          console.error("Error fetching Transformers data:", error);
        });
    };

    fetchTransformer1Data(); // Initial fetch
    const interval = setInterval(fetchTransformer1Data, 60000); // Fetch every 1 minute

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [transformer1StartDate, transformer1EndDate]);

  useEffect(() => {
    const fetchAll_GensetData = () => {
      const apiUrl = `https://gclapi.jiotp.com//solar_vs_trans.php?start_date=${All_GensetStartDate}&end_date=${All_GensetEndDate}`;
      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          if (data && data.total_consumption) {
            setAll_GensetValue(data.total_consumption.All_Genset);
          }
        })
        .catch((error) => {
          console.error("Error fetching All_Genset data:", error);
        });
    };

    fetchAll_GensetData(); // Initial fetch
    const interval = setInterval(fetchAll_GensetData, 60000); // Fetch every 1 minute

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [All_GensetStartDate, All_GensetEndDate]);

  useEffect(() => {
    const fetchAll_ConsumptionData = async () => {
      const apiUrl = `https://gclapi.jiotp.com//total_consumption.php?start_date=${All_ConsumptionStartDate}&end_date=${All_ConsumptionEndDate}`;
      console.log("Fetching:", apiUrl);

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        console.log("API Response:", data);

        if (data?.total_consumption?.Total_Consumption) {
          setAll_ConsumptionValue(
            parseFloat(data.total_consumption.Total_Consumption)
          );
        } else {
          console.error("Invalid data format:", data);
          setAll_ConsumptionValue(null);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setAll_ConsumptionValue(null);
      }
    };

    fetchAll_ConsumptionData(); // Initial fetch
    const interval = setInterval(fetchAll_ConsumptionData, 60000); // Refresh every 1 minute

    return () => clearInterval(interval);
  }, [All_ConsumptionStartDate, All_ConsumptionEndDate]);

  useEffect(() => {
    const fetchAll_productionData = async () => {
      const apiUrl = `https://gclapi.jiotp.com//unaccoutable_energy.php?start_date=${All_productionStartDate}&end_date=${All_productionEndDate}`;
      console.log("Fetching:", apiUrl);

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        console.log("API Response:", data);

        if (data?.total_consumption?.totalproduction) {
          setAll_productionValue(
            parseFloat(data.total_consumption.totalproduction)
          );
        } else {
          console.error("Invalid data format:", data);
          setAll_productionValue(null);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setAll_productionValue(null);
      }
    };

    fetchAll_productionData(); // Initial fetch
    const interval = setInterval(fetchAll_productionData, 60000); // Refresh every 1 minute

    return () => clearInterval(interval);
  }, [All_productionStartDate, All_productionEndDate]);

  useEffect(() => {
    const fetchAll_energyData = async () => {
      const apiUrl = `https://gclapi.jiotp.com//unaccoutable_energy.php?start_date=${All_energyStartDate}&end_date=${All_energyEndDate}`;
      console.log("Fetching:", apiUrl);

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        console.log("API Response:", data);

        if (data?.total_consumption?.Unaccountable_Energy) {
          setAll_energyValue(
            parseFloat(data.total_consumption.Unaccountable_Energy)
          );
        } else {
          console.error("Invalid data format:", data);
          setAll_energyValue(null);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setAll_energyValue(null);
      }
    };

    fetchAll_energyData(); // Initial fetch
    const interval = setInterval(fetchAll_energyData, 60000); // Refresh every 1 minute

    return () => clearInterval(interval);
  }, [All_energyStartDate, All_energyEndDate]);

  useEffect(() => {
    const createProductionChart = async () => {
      const chartId = "productionChart";
      const chartContainer = document.getElementById(chartId);

      if (chartContainer) {
        const chart = am4core.create(chartId, am4charts.XYChart);
        chart.logo.disabled = true;

        // Dynamic API URL for production chart
        const apiUrl = `https://gclapi.jiotp.com//solar_vs_trans_com.php?start_date=${startDate}&end_date=${endDate}&label=${timePeriod}`;

        try {
          const response = await axios.get(apiUrl);
          const data = response.data;

          chart.data = data;

          chart.dateFormatter.inputDateFormat = "yyyy-MM-ddTHH:mm:SS.SSS+zz:zz";

          // Create X-axis (Date Axis)
          const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
          dateAxis.renderer.grid.template.location = 0;
          dateAxis.renderer.minGridDistance = 50;
          dateAxis.renderer.labels.template.fontSize = 14;

          // Create primary Y-axis (for generated and transformer power in kW)
          const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
          valueAxis.renderer.labels.template.fill = am4core.color("#666666");
          valueAxis.renderer.labels.template.fontSize = 12;
          valueAxis.renderer.labels.template.fontWeight = "bold";
          valueAxis.title.rotation = -90;
          valueAxis.title.fill = am4core.color("#666666");
          valueAxis.title.fontSize = 14;
          valueAxis.title.fontWeight = "bold";
          valueAxis.title.valign = "middle";
          valueAxis.title.align = "center";
          valueAxis.title.fill = am4core.color("grey");
          valueAxis.title.text = "kW";
          valueAxis.title.rotation = -90;
          valueAxis.min = 0; // Set minimum value to 0
          valueAxis.strictMinMax = true;

          // Create secondary Y-axis (for solar usage %)
          var secondaryValueAxis = chart.yAxes.push(new am4charts.ValueAxis());
          secondaryValueAxis.renderer.opposite = true; // Place the secondary axis on the right
          secondaryValueAxis.renderer.grid.template.strokeOpacity = 0;
          secondaryValueAxis.renderer.grid.template.stroke =
            am4core.color("#D0D0D0");
          secondaryValueAxis.renderer.minGridDistance = 30;
          secondaryValueAxis.renderer.labels.template.fill =
            am4core.color("#666666");
          secondaryValueAxis.renderer.labels.template.fontSize = 12;
          secondaryValueAxis.renderer.labels.template.fontWeight = "bold";
          secondaryValueAxis.title.text = "SOLAR USAGE (%)";
          secondaryValueAxis.title.rotation = -90;
          secondaryValueAxis.title.fill = am4core.color("#666666");
          secondaryValueAxis.title.fontSize = 14;
          secondaryValueAxis.title.fontWeight = "bold";
          secondaryValueAxis.title.valign = "middle";
          secondaryValueAxis.title.align = "center";
          secondaryValueAxis.title.fill = am4core.color("grey");
          secondaryValueAxis.title.dy = -15;
          secondaryValueAxis.title.dx = 0;
          secondaryValueAxis.min = 0;
          secondaryValueAxis.max = 100; // Assuming solar_usage is a percentage

          // Series for Generated Power (Primary Y-Axis)
          const generatedPowerSeries = chart.series.push(
            new am4charts.ColumnSeries()
          );
          generatedPowerSeries.dataFields.valueY = "sum_avg_G2_U20_and_U_27";
          generatedPowerSeries.dataFields.dateX = "date";
          generatedPowerSeries.name = "Solar Power";
          generatedPowerSeries.tooltipText =
            "Solar Power: [bold]{valueY} kW[/]";
          generatedPowerSeries.columns.template.fill = am4core.color("#219ebc");

          // Series for Transformer Power (Primary Y-Axis)
          const transformerPowerSeries = chart.series.push(
            new am4charts.ColumnSeries()
          );
          transformerPowerSeries.dataFields.valueY = "sum_avg_U_24_and_U_25";
          transformerPowerSeries.dataFields.dateX = "date";
          transformerPowerSeries.name = "Transformers Power";
          transformerPowerSeries.tooltipText =
            "Transformers Power: [bold]{valueY} kW[/]";
          transformerPowerSeries.columns.template.fill =
            am4core.color("#023047");

          const GensetPowerSeries = chart.series.push(
            new am4charts.ColumnSeries()
          );
          GensetPowerSeries.dataFields.valueY =
            "sum_avg_G1_U16_and_G1_U17_and_G1_U18_and_G1_U19";
          GensetPowerSeries.dataFields.dateX = "date";
          GensetPowerSeries.name = "Genset Power";
          GensetPowerSeries.tooltipText = "Genset Power: [bold]{valueY} kW[/]";
          GensetPowerSeries.columns.template.fill = am4core.color("#d8e2dc");

          // Series for Solar Usage (Secondary Y-Axis)
          var solarUsageSeries = chart.series.push(new am4charts.LineSeries());
          solarUsageSeries.dataFields.valueY = "solar_usage";
          solarUsageSeries.dataFields.dateX = "date";
          solarUsageSeries.yAxis = secondaryValueAxis; // Assign the series to the secondary axis
          solarUsageSeries.name = "Solar Usage";
          solarUsageSeries.tooltipText = "Solar Usage: [bold]{valueY}%[/]";
          solarUsageSeries.strokeWidth = 3;
          solarUsageSeries.stroke = am4core.color("#FFA500"); // Orange color
          solarUsageSeries.tooltip.background.fill = am4core.color("#FFA500");
          solarUsageSeries.tooltip.getFillFromObject = false;
          solarUsageSeries.tooltip.autoBackground = true;
          solarUsageSeries.tooltip.background.cornerRadius = 5;
          solarUsageSeries.tooltip.background.strokeWidth = 2;
          solarUsageSeries.tooltip.pointerOrientation = "vertical";
          solarUsageSeries.tooltip.label.minWidth = 150;
          solarUsageSeries.tooltip.label.minHeight = 20;
          solarUsageSeries.tooltip.label.textAlign = "middle";
          solarUsageSeries.tooltip.autoTextColor = false;
          solarUsageSeries.showOnInit = true;
          // Add a bullet to the Solar Usage series (Optional: to improve visibility of data points)
          const solarUsageBullet = solarUsageSeries.bullets.push(
            new am4charts.CircleBullet()
          );
          solarUsageBullet.circle.fill = am4core.color("#FFA500");
          solarUsageBullet.circle.strokeWidth = 2;
          solarUsageBullet.circle.stroke = am4core.color("#FFFFFF");

          // Set the tooltip color to match the series color
          solarUsageSeries.tooltip.background.fill = am4core.color("#FFA500");
          solarUsageSeries.tooltip.label.fill = am4core.color("#FFFFFF");

          // Enable cursor and tooltips
          chart.cursor = new am4charts.XYCursor();
          chart.cursor.lineY.disabled = false;
          chart.cursor.lineX.disabled = false;
          chart.cursor.behavior = "none"; // Disable zoom on drag

          // Set cursor tooltip for Solar Usage
          chart.cursor.events.on("cursorpositionchanged", function () {
            const dataPoint = solarUsageSeries.tooltipDataItem?.dataContext;
            if (dataPoint) {
              chart.cursor.tooltipText = `Solar Usage: ${dataPoint.solar_usage}%`;
            }
          });

          // Minimize legend icon size and text size
          chart.legend = new am4charts.Legend();
          chart.legend.position = "bottom"; // Adjust position to "bottom" for better mobile view
          chart.legend.valign = "middle";
          chart.legend.fontSize = 14;
          chart.legend.maxWidth = am4core.percent(100); // Ensure it takes full width for smaller screens
          chart.legend.labels.template.maxWidth = 100;
          chart.legend.scrollable = true;
          chart.legend.valueLabels.template.disabled = true;
          // chart.legend.marginTop = 20;
          // chart.legend.paddingBottom = 20; // Adjust the value as needed

          // Legend markers configuration
          var markerTemplate = chart.legend.markers.template;
          markerTemplate.width = 10;
          markerTemplate.height = 10;
          // Store the chart reference
          productionChartRef.current = chart;
        } catch (error) {
          console.error("Error fetching Production Chart data:", error);
        }
      }
    };
    const fetchDataAndUpdateCharts1 = async () => {
      setLoading(true);
      setError(null);

      try {
        await createProductionChart();
      } catch (error) {
        setError("An error occurred while fetching chart data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDataAndUpdateCharts1();

    return () => {
      if (productionChartRef.current) {
        productionChartRef.current.dispose();
      }
    };
  }, [startDate, endDate, timePeriod]); // Re-fetch data when timePeriod changes

  useEffect(() => {
    const createSolarPieChart = async () => {
      const chartId = "solarPieChart";
      const chartContainer = document.getElementById(chartId);

      if (chartContainer) {
        const chart = am4core.create(chartId, am4charts.PieChart);
        chart.logo.disabled = true;

        try {
          const formattedStartDate1 = startDate1.toISOString().split("T")[0];
          const formattedEndDate1 = endDate1.toISOString().split("T")[0];
          const apiUrl = `https://gclapi.jiotp.com//pie_api.php?start_date=${formattedStartDate1}&end_date=${formattedEndDate1}&meterId=G2_U20,U_27&suffixes=ACTIVE_ENERGY_IMPORT_KWH`;
          const response = await axios.get(apiUrl);

          const data = response.data.total_consumption;
          const chartData = Object.keys(data).map((key) => ({
            category: key,
            value: data[key],
          }));

          chart.data = chartData;

          const pieSeries = chart.series.push(new am4charts.PieSeries());
          pieSeries.dataFields.value = "value";
          pieSeries.dataFields.category = "category";
          pieSeries.slices.template.tooltipText =
            "{category}: [bold]{value}[/]";

          // Apply custom colors
          const colorSet = new am4core.ColorSet();
          colorSet.list = [am4core.color("#ff983b"), am4core.color("#eeb299")];
          pieSeries.colors = colorSet;
          pieSeries.labels.template.disabled = true;
          pieSeries.ticks.template.disabled = true;

          // Minimize legend icon size and text size
          chart.legend = new am4charts.Legend();
          chart.legend.position = "bottom"; // Adjust position to "bottom" for better mobile view
          chart.legend.valign = "middle";
          chart.legend.fontSize = 14;
          chart.legend.maxWidth = am4core.percent(100); // Ensure it takes full width for smaller screens
          chart.legend.labels.template.maxWidth = 100;
          chart.legend.scrollable = true;
          chart.legend.valueLabels.template.disabled = true;

          // Legend markers configuration
          var markerTemplate = chart.legend.markers.template;
          markerTemplate.width = 10;
          markerTemplate.height = 10;

          solarPieChartRef.current = chart;
        } catch (error) {
          console.error("Error fetching Solar Pie Chart data:", error);
        }
      }
    };

    const createTransformerPieChart = async () => {
      const chartId = "transformerPieChart";
      const chartContainer = document.getElementById(chartId);

      if (chartContainer) {
        const chart = am4core.create(chartId, am4charts.PieChart);
        chart.logo.disabled = true;

        try {
          const formattedStartDate1 = startDate1.toISOString().split("T")[0];
          const formattedEndDate1 = endDate1.toISOString().split("T")[0];
          const apiUrl = `https://gclapi.jiotp.com//pie_api.php?start_date=${formattedStartDate1}&end_date=${formattedEndDate1}&meterId=U_24,U_25&suffixes=ACTIVE_ENERGY_IMPORT_KWH`;
          const response = await axios.get(apiUrl);

          const data = response.data.total_consumption;
          const chartData = Object.keys(data).map((key) => ({
            category: key,
            value: data[key],
          }));

          chart.data = chartData;

          const pieSeries = chart.series.push(new am4charts.PieSeries());
          pieSeries.dataFields.value = "value";
          pieSeries.dataFields.category = "category";
          pieSeries.slices.template.tooltipText =
            "{category}: [bold]{value}[/] kWh";

          // Apply custom colors
          const colorSet = new am4core.ColorSet();
          colorSet.list = [am4core.color("#78dcfe"), am4core.color("#3c9fe2")];
          pieSeries.colors = colorSet;
          pieSeries.labels.template.disabled = true;
          pieSeries.ticks.template.disabled = true;

          // Minimize legend icon size and text size
          chart.legend = new am4charts.Legend();
          chart.legend.position = "bottom"; // Adjust position to "bottom" for better mobile view
          chart.legend.valign = "middle";
          chart.legend.fontSize = 14;
          chart.legend.maxWidth = am4core.percent(100); // Ensure it takes full width for smaller screens
          chart.legend.labels.template.maxWidth = 100;
          chart.legend.scrollable = true;
          chart.legend.valueLabels.template.disabled = true;

          // Legend markers configuration
          var markerTemplate = chart.legend.markers.template;
          markerTemplate.width = 10;
          markerTemplate.height = 10;

          transformerPieChartRef.current = chart;
        } catch (error) {
          console.error("Error fetching Transformer Pie Chart data:", error);
        }
      }
    };

    const createSolarsVsTransformersChart = async () => {
      const chartId = "solarsVsTransformersChart";
      const chartContainer = document.getElementById(chartId);

      if (chartContainer) {
        const chart = am4core.create(chartId, am4charts.PieChart);
        chart.logo.disabled = true;

        try {
          const formattedStartDate1 = startDate1.toISOString().split("T")[0];
          const formattedEndDate1 = endDate1.toISOString().split("T")[0];
          const apiUrl = `https://gclapi.jiotp.com//solar_vs_trans.php?start_date=${formattedStartDate1}&end_date=${formattedEndDate1}`;
          const response = await axios.get(apiUrl);

          const data = response.data.total_consumption;
          const chartData = Object.keys(data).map((key) => ({
            category: key,
            value: data[key],
          }));

          chart.data = chartData;

          const pieSeries = chart.series.push(new am4charts.PieSeries());
          pieSeries.dataFields.value = "value";
          pieSeries.dataFields.category = "category";
          pieSeries.slices.template.tooltipText =
            "{category}: [bold]{value}[/] kWh";

          // Disable outside labels
          pieSeries.labels.template.disabled = true;
          pieSeries.ticks.template.disabled = true;

          // Apply custom colors
          const colorSet = new am4core.ColorSet();
          colorSet.list = [am4core.color("#e67f22"), am4core.color("#3598db")];
          pieSeries.colors = colorSet;
          pieSeries.labels.template.disabled = true;
          pieSeries.ticks.template.disabled = true;

          // Minimize legend icon size and text size
          chart.legend = new am4charts.Legend();
          chart.legend.position = "bottom"; // Adjust position to "bottom" for better mobile view
          chart.legend.valign = "middle";
          chart.legend.fontSize = 14;
          chart.legend.maxWidth = am4core.percent(100); // Ensure it takes full width for smaller screens
          chart.legend.labels.template.maxWidth = 100;
          chart.legend.scrollable = true;
          chart.legend.valueLabels.template.disabled = true;

          // Legend markers configuration
          var markerTemplate = chart.legend.markers.template;
          markerTemplate.width = 10;
          markerTemplate.height = 10;

          solarsVsTransformersChartRef.current = chart;
        } catch (error) {
          console.error("Error fetching Solars vs Transformers data:", error);
        }
      }
    };

    const fetchDataAndUpdateCharts = async () => {
      setLoading(true);
      setError(null);

      try {
        await createSolarPieChart();
        await createTransformerPieChart();
        await createSolarsVsTransformersChart();
      } catch (error) {
        setError("An error occurred while fetching chart data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDataAndUpdateCharts();

    return () => {
      if (solarPieChartRef.current) {
        solarPieChartRef.current.dispose();
      }
      if (transformerPieChartRef.current) {
        transformerPieChartRef.current.dispose();
      }
      if (solarsVsTransformersChartRef.current) {
        solarsVsTransformersChartRef.current.dispose();
      }
    };
  }, [startDate1, endDate1]); // Re-fetch data when timePeriod changes

  //last div

  const fetchChartData1 = async (value) => {
    setLoading1(true);
    setError1(null);

    const apiUrl1 = `https://gclapi.jiotp.com//total_consumption_pp.php?value=${value}`;

    try {
      const response = await fetch(apiUrl1);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched Data for", value, ":", data); // Debugging
      updateChart1(data, value);
    } catch (err) {
      setError1("Failed to fetch chart data.");
      console.error("Error fetching chart data:", err);
    } finally {
      setLoading1(false);
    }
  };
  const updateChart1 = (data, value) => {
    // Create the chart instance in the container with id "chartdiv4"
    const chart = am4core.create("chartdiv5", am4charts.XYChart);
    if (chart.logo) {
      chart.logo.disabled = true;
    }

    // Set up legend
    chart.legend = new am4charts.Legend();
    chart.legend.position = "bottom";
    chart.legend.valign = "middle";
    chart.legend.maxWidth = 180;
    chart.legend.scrollable = true;
    const markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 9;
    markerTemplate.height = 9;
    chart.legend.paddingBottom = 20;
    chart.legend.labels.template.fontSize = "12px";

    // Dynamic mapping based on the value parameter:
    let xField, series1Field, series2Field, series1Name, series2Name;

    if (value === "today") {
      // Expected API output: { "Time": "00:00", "Yesterday_Flow": number, "Today_Flow": number }
      xField = "Time";
      series1Field = "Yesterday";
      series2Field = "Today";
      series1Name = "Yesterday(kWh)";
      series2Name = "Today(kWh)";
    } else if (value === "week") {
      // Expected API output: { "Days": "Mon", "Last Week Flow": number, "This Week Flow": number }
      xField = "Day";
      series1Field = "Last Week";
      series2Field = "This Week";
      series1Name = "Last Week(kWh)";
      series2Name = "This Week(kWh)";
    } else if (value === "month") {
      // Expected API output: { "Weeks": "Week1", "Last Month": number, "This Month": number }
      xField = "Weeks";
      series1Field = "Last Month";
      series2Field = "This Month";
      series1Name = "Last Month(kWh)";
      series2Name = "This Month(kWh)";
    } else if (value === "year") {
      // Expected API output: { "Month": "Jan", "Previous Year": number, "Current Year": number }
      xField = "Month";
      series1Field = "Previous Year";
      series2Field = "Current Year";
      series1Name = "Previous Year(kWh)";
      series2Name = "Current Year(kWh)";
    } else {
      // Fallback mapping (if needed)
      xField = "Time";
      series1Field = "Value1";
      series2Field = "Value2";
      series1Name = "Series 1";
      series2Name = "Series 2";
    }

    // Set the chart data (ensure your backend sends valid JSON)
    chart.data = data;

    // Clear any existing axes and series
    chart.xAxes.clear();
    chart.yAxes.clear();
    chart.series.clear();

    // Configure X-Axis (CategoryAxis)
    const xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    xAxis.dataFields.category = xField;
    xAxis.renderer.grid.template.location = 0;
    xAxis.renderer.line.strokeOpacity = 1;
    xAxis.renderer.minGridDistance = 50;
    xAxis.renderer.cellStartLocation = 0.1;
    xAxis.renderer.cellEndLocation = 0.9;
    xAxis.renderer.labels.template.fontSize = "12px";
    chart.colors.list = [am4core.color("#67B7DC"), am4core.color("#1F5897")];

    // Configure Y-Axis (ValueAxis)
    const yAxis = chart.yAxes.push(new am4charts.ValueAxis());
    yAxis.min = 0;
    yAxis.renderer.labels.template.fontSize = "12px";

    // Helper function: Create a column series
    function createSeries(field, name) {
      const series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = field; // E.g., "Today_Flow" or "This Month"
      series.dataFields.categoryX = xField; // E.g., "Time" or "Weeks"
      series.name = name;
      series.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
      series.columns.template.width = am4core.percent(50);
      series.tooltip.pointerOrientation = "vertical";
      series.tooltip.dy = -10;
      series.tooltip.label.textAlign = "middle";
      series.tooltip.background.stroke = am4core.color("#000");
      series.tooltip.background.strokeWidth = 2;
      return series;
    }

    // Create series for both groups:
    createSeries(series1Field, series1Name);
    createSeries(series2Field, series2Name);

    // Add a cursor for interactivity
    chart.cursor = new am4charts.XYCursor();
  };

  /// solar, genreration or genset

  // API Endpoints
  const categoryApis = {
    "Solar Generation": "https://gclapi.jiotp.com//solar_pp.php?value=",
    Genset: "https://gclapi.jiotp.com//Genset_pp.php?value=",
    FESCO: "https://gclapi.jiotp.com//transformer_pp.php?value=",
  };

  useEffect(() => {
    fetchChartData();
  }, [selectedCategory, selectedTimePeriod]);

  // Fetch Data and Update Chart
  const fetchChartData = async () => {
    setLoading2(true);
    setError2(null);

    const apiUrl = `${categoryApis[selectedCategory]}${selectedTimePeriod}`;
    console.log("Fetching data from:", apiUrl); // Debugging

    try {
      const response = await axios.get(apiUrl);
      console.log("API Response:", response.data);

      if (!response.data || response.data.length === 0) {
        setError2("No data available.");
        return;
      }

      updateChart(response.data, selectedTimePeriod);
    } catch (err) {
      setError("Failed to fetch chart data.");
      console.error("Error fetching data:", err);
    } finally {
      setLoading2(false);
    }
  };

  // Update Chart Function
  const updateChart = (data, value) => {
    // Create the chart instance in the container with id "chartdiv4"
    const chart = am4core.create("chartdiv4", am4charts.XYChart);
    if (chart.logo) {
      chart.logo.disabled = true;
    }

    // Set up legend
    chart.legend = new am4charts.Legend();
    chart.legend.position = "bottom";
    chart.legend.valign = "middle";
    chart.legend.maxWidth = 180;
    chart.legend.scrollable = true;
    const markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 9;
    markerTemplate.height = 9;
    chart.legend.paddingBottom = 20;
    chart.legend.labels.template.fontSize = "12px";

    // Dynamic mapping based on the value parameter:
    let xField, series1Field, series2Field, series1Name, series2Name;

    if (value === "today") {
      // Expected API output: { "Time": "00:00", "Yesterday_Flow": number, "Today_Flow": number }
      xField = "Time";
      series1Field = "Yesterday";
      series2Field = "Today";
      series1Name = "Yesterday(kWh)";
      series2Name = "Today(kWh)";
    } else if (value === "week") {
      // Expected API output: { "Days": "Mon", "Last Week Flow": number, "This Week Flow": number }
      xField = "Day";
      series1Field = "Last Week";
      series2Field = "This Week";
      series1Name = "Last Week(kWh)";
      series2Name = "This Week(kWh)";
    } else if (value === "month") {
      // Expected API output: { "Weeks": "Week1", "Last Month": number, "This Month": number }
      xField = "Weeks";
      series1Field = "Last Month";
      series2Field = "This Month";
      series1Name = "Last Month(kWh)";
      series2Name = "This Month(kWh)";
    } else if (value === "year") {
      // Expected API output: { "Month": "Jan", "Previous Year": number, "Current Year": number }
      xField = "Month";
      series1Field = "Previous Year";
      series2Field = "Current Year";
      series1Name = "Previous Year(kWh)";
      series2Name = "Current Year(kWh)";
    } else {
      // Fallback mapping (if needed)
      xField = "Time";
      series1Field = "Value1";
      series2Field = "Value2";
      series1Name = "Series 1";
      series2Name = "Series 2";
    }

    // Set the chart data (ensure your backend sends valid JSON)
    chart.data = data;

    // Clear any existing axes and series
    chart.xAxes.clear();
    chart.yAxes.clear();
    chart.series.clear();

    // Configure X-Axis (CategoryAxis)
    const xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    xAxis.dataFields.category = xField;
    xAxis.renderer.grid.template.location = 0;
    xAxis.renderer.line.strokeOpacity = 1;
    xAxis.renderer.minGridDistance = 50;
    xAxis.renderer.cellStartLocation = 0.1;
    xAxis.renderer.cellEndLocation = 0.9;
    xAxis.renderer.labels.template.fontSize = "12px";
    chart.colors.list = [am4core.color("#67B7DC"), am4core.color("#1F5897")];

    // Configure Y-Axis (ValueAxis)
    const yAxis = chart.yAxes.push(new am4charts.ValueAxis());
    yAxis.min = 0;
    yAxis.renderer.labels.template.fontSize = "12px";

    // Helper function: Create a column series
    function createSeries(field, name) {
      const series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = field; // E.g., "Today_Flow" or "This Month"
      series.dataFields.categoryX = xField; // E.g., "Time" or "Weeks"
      series.name = name;
      series.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
      series.columns.template.width = am4core.percent(50);
      series.tooltip.pointerOrientation = "vertical";
      series.tooltip.dy = -10;
      series.tooltip.label.textAlign = "middle";
      series.tooltip.background.stroke = am4core.color("#000");
      series.tooltip.background.strokeWidth = 2;
      return series;
    }

    // Create series for both groups:
    createSeries(series1Field, series1Name);
    createSeries(series2Field, series2Name);

    // Add a cursor for interactivity
    chart.cursor = new am4charts.XYCursor();
  };

  return (
    <main className="p-1 mt-[-12px]">
      <div className="">
        <label className="font-bold">Select Date Range:</label>
        <select
          className="border-2 mt-2 border-gray-300 rounded p-1 cursor-pointer w-[8vw]  ml-2 appearance-none bg-white text-gray-700 py-1 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={selectedDate}
          onChange={handleDropdownChange}
        >
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="this_week">This Week</option>
          <option value="last_week">Last Week</option>
          <option value="this_month">This Month</option>
          <option value="last_month">Last Month</option>
          <option value="this_year">This Year</option>
        </select>
      </div>
      <div className=" h-[83vh] overflow:auto">
        <div className="flex flex-wrap lg:flex-nowrap gap-2 mt-[-30px]">
          {/* Transformers Div */}
          <Div
            title={
              <span
                className="truncate max-w-[11.5rem] block cursor-pointer"
                title="FESCO"
              >
                FESCO Import
              </span>
            }
            hide={"hidden"}
            height={"130px"}
            length="w-full sm:w-[44.5%] md:w-[32%] lg:w-[24.5%] mt-10 border-t-[5px] border-[#1f5897]"
            className="flex items-center justify-center"
          >
            {transformerValue !== null ? (
              <p className="text-2xl font-bold text-center h-full pt-[50px]">
                {transformerValue.toFixed(2)} kWh
              </p>
            ) : (
              <div className="flex items-center justify-center mt-4 overflow-hidden text-ellipsis">
                <p>Loading...</p>
              </div>
            )}
          </Div>

          {/* Solar Generation Div */}
          <Div
            title={"Solar Generation"}
            hide={"hidden"}
            height={"130px"}
            length="w-full sm:w-[44.5%] md:w-[32%] lg:w-[24.5%] mt-10 border-t-[5px] border-[#1f5897]"
            className="flex items-center justify-center"
          >
            {solarValue !== null ? (
              <p className="text-2xl font-bold text-center h-full pt-[50px]">
                {solarValue.toFixed(2)} kWh
              </p>
            ) : (
              <div className="flex items-center justify-center mt-4 overflow-hidden text-ellipsis">
                <p>Loading...</p>
              </div>
            )}
          </Div>

          {/* WAPDA Export Div */}
          <Div
            title={
              <span
                className="truncate max-w-[11.5rem] block cursor-pointer"
                title="FESCO"
              >
                FESCO Export
              </span>
            }
            hide={"hidden"}
            height={"130px"}
            length="w-full sm:w-[44.5%] md:w-[32%] lg:w-[24.5%] mt-10 border-t-[5px] border-[#1f5897]"
            className="flex items-center justify-center"
          >
            {typeof transformer1Value === "number" &&
            !isNaN(transformer1Value) ? (
              <p className="text-2xl font-bold text-center h-full pt-[50px]">
                {transformer1Value.toFixed(2)} kWh
              </p>
            ) : (
              <div className="flex items-center justify-center mt-4 overflow-hidden text-ellipsis">
                <p>Loading...</p>
              </div>
            )}
          </Div>

          {/* Total Genset Div */}
          <Div
            title={
              <span
                className="truncate max-w-[11.5rem] block cursor-pointer"
                title="All Genset"
              >
                Total Genset
              </span>
            }
            hide={"hidden"}
            height={"130px"}
            length="w-full sm:w-[44.5%] md:w-[32%] lg:w-[24.5%] mt-10 border-t-[5px] border-[#1f5897]"
            className="flex items-center justify-center"
          >
            {All_GensetValue !== null ? (
              <p className="text-2xl font-bold text-center h-full pt-[50px]">
                {All_GensetValue.toFixed(2)} kWh
              </p>
            ) : (
              <div className="flex items-center justify-center mt-4 overflow-hidden text-ellipsis">
                <p>Loading...</p>
              </div>
            )}
          </Div>
        </div>

        <div className="flex flex-wrap gap-2 lg:flex-nowrap">
          <Div
            title={
              <span
                className="w-full inline-block cursor-pointer text-center whitespace-nowrap overflow-visible"
                title="Total Generation (Solar+FESCO(I)+Genset)"
              >
                Total Generation (Solar+FESCO(I)+Genset)
              </span>
            }
            hide={"hidden"}
            height={"130px"}
            length={
              "w-full sm:w-[49%] lg:w-[32.6%] border-t-[5px] border-[#1f5897]"
            }
            className="flex items-center justify-center"
          >
            {All_ConsumptionValue !== null ? (
              <p className="text-2xl font-bold text-center h-full pt-[50px]">
                {All_ConsumptionValue.toFixed(2)} kWh
              </p>
            ) : (
              <div className="flex items-center justify-center mt-4 overflow-hidden text-ellipsis">
                <p>Loading...</p>
              </div>
            )}
          </Div>

          <Div
            title={
              <span
                className="truncate max-w-[11.5rem] block cursor-pointer"
                title="Total Consumption"
              >
                Total Consumption
              </span>
            }
            hide={"hidden"}
            height={"130px"}
            length={
              "w-full sm:w-[49%] lg:w-[32.8%] border-t-[5px] border-[#1f5897]"
            }
            className="flex items-center justify-center"
          >
            {All_productionValue !== null ? (
              <p className="text-2xl font-bold text-center h-full pt-[50px]">
                {All_productionValue.toFixed(2)} kWh
              </p>
            ) : (
              <div className="flex items-center justify-center mt-4 overflow-hidden text-ellipsis">
                <p>Loading...</p>
              </div>
            )}
          </Div>

          <Div
            title={
              <span
                className="cursor-pointer whitespace-nowrap"
                title="Unaccounted Energy"
              >
                Unaccounted Energy
              </span>
            }
            hide={"hidden"}
            height={"130px"}
            length={
              "w-full sm:w-[49.5%] lg:w-[33.2%]  border-t-[5px] border-[#1f5897]"
            }
            className="flex items-center justify-center"
          >
            {All_energyValue !== null ? (
              <p className="text-2xl font-bold text-center h-full pt-[50px]">
                {All_energyValue.toFixed(2)} kWh
              </p>
            ) : (
              <div className="flex items-center justify-center mt-4 overflow-hidden text-ellipsis">
                <p>Loading...</p>
              </div>
            )}
          </Div>
        </div>
        <div className="flex flex-wrap gap-2 ">
          <div className="flex flex-wrap lg:flex-nowrap gap-4 w-full ">
            <div className="relative w-full lg:w-[35%] xl:w-[30%] border-t-[5px] border-[#1F5897] rounded-xl max-h-[34vh] shadow-lg overflow-auto">
              {/* Background Layer */}
              <div
                className="absolute inset-0 bg-[#f2f2f2] rounded-xl"
                style={{ opacity: 0.5 }}
              ></div>

              {/* Content Layer */}
              <div className="relative z-10 p-3 px-4">
                {/* Header Section */}
                <div className="flex justify-between items-center border-b border-white mt-[2px]">
                  <h2 className="text-lg font-semibold text-gray-700">
                    Weather
                  </h2>
                </div>

                {/* Location */}
                <div className="text-sm text-gray-600 mt-2 flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span className="font-medium">Pakistan, Faisalabad</span>
                </div>

                {/* Temperature Section */}
                <div className="mt-2">
                  {weather &&
                  weather.daily &&
                  weather.daily.temperature_2m_max?.[0] &&
                  weather.daily.temperature_2m_min?.[0] ? (
                    <div className="flex justify-end text-lg font-semibold mt-[-25px] mb-3 mr-2">
                      <div className="flex flex-col items-center mr-8">
                        <p className="text-xs text-black">MIN</p>
                        <span className="text-sm font-light">
                          {weather.daily.temperature_2m_min[0]}°C
                        </span>
                      </div>
                      <div className="flex flex-col items-center">
                        <p className="text-xs text-black">MAX</p>
                        <span className="text-sm font-light">
                          {weather.daily.temperature_2m_max[0]}°C
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-center text-gray-600">
                      Temperature data not available
                    </p>
                  )}
                </div>

                {/* WeatherCard Section */}
                {weather && weather.current_weather ? (
                  (() => {
                    const code = weather.current_weather.weathercode;
                    const temp = weather.current_weather.temperature;
                    const precipitation =
                      weather.daily?.precipitation_sum?.[0] ?? "N/A";

                    if ([61, 63, 65, 80, 81, 82].includes(code)) {
                      return (
                        <WeatherCard
                          icon={
                            <img
                              src="Rainy.png"
                              alt="Rainy"
                              className="w-[6vw] h-[5vw]"
                            />
                          }
                          label="Rainy"
                          temp={temp}
                          color="blue"
                          precipitation={precipitation}
                        />
                      );
                    } else if ([0, 1].includes(code)) {
                      return (
                        <WeatherCard
                          icon={
                            <img
                              src="sun.png"
                              alt="Sunny"
                              className="w-[6vw] h-[5vw]"
                            />
                          }
                          label="Sunny"
                          temp={temp}
                          color="yellow"
                        />
                      );
                    } else if (code === 2) {
                      return (
                        <WeatherCard
                          icon={
                            <img
                              src="partly_cloudy.png"
                              alt="Partly Cloudy"
                              className="w-[6vw] h-[5vw]"
                            />
                          }
                          label="Partly Cloudy"
                          temp={temp}
                          color="gray"
                        />
                      );
                    } else if (code === 3) {
                      return (
                        <WeatherCard
                          icon={
                            <img
                              src="overcast.png"
                              alt="Overcast"
                              className="w-[6vw] h-[5vw]"
                            />
                          }
                          label="Overcast"
                          temp={temp}
                          color="gray"
                        />
                      );
                    } else if ([45, 48].includes(code)) {
                      return (
                        <WeatherCard
                          icon={
                            <img
                              src="fog.png"
                              alt="Fog"
                              className="w-[6vw] h-[5vw]"
                            />
                          }
                          label="Fog"
                          temp={temp}
                          color="gray"
                        />
                      );
                    } else if ([95, 96, 99].includes(code)) {
                      return (
                        <WeatherCard
                          icon={
                            <img
                              src="thunder_storm.png"
                              alt="Thunderstorm"
                              className="w-[6vw] h-[5vw]"
                            />
                          }
                          label="Thunderstorm"
                          temp={temp}
                          color="purple"
                        />
                      );
                    } else if ([71, 73, 75, 77, 85, 86].includes(code)) {
                      return (
                        <WeatherCard
                          icon={
                            <img
                              src="snowy.png"
                              alt="Snow"
                              className="w-[6vw] h-[5vw]"
                            />
                          }
                          label="Snow"
                          temp={temp}
                          color="blue"
                        />
                      );
                    } else if ([51, 53, 55, 56, 57].includes(code)) {
                      return (
                        <WeatherCard
                          icon={
                            <img
                              src="drizzle.png"
                              alt="Drizzle"
                              className="w-[6vw] h-[5vw]"
                            />
                          }
                          label="Drizzle"
                          temp={temp}
                          color="teal"
                        />
                      );
                    } else {
                      return (
                        <WeatherCard
                          icon={<WiNa className="text-7xl" />}
                          label="Unknown Weather"
                          temp={temp}
                          color="gray"
                        />
                      );
                    }
                  })()
                ) : (
                  <div className="mt-4 p-4 rounded-lg shadow-md bg-gray-100 text-center text-gray-500">
                    Weather data not available.
                  </div>
                )}

                {/* <hr className="my-2 border-t-2 border-gray-300 mt-[-6px]" /> */}

                {/* Sunrise, Sunset, Radiation */}
                <div className="grid grid-cols-3 gap-2 h-[5.5vw]">
                  {/* Sunrise */}
                  <div className="flex flex-col items-center p-2 rounded-lg shadow-md max-w-[200px]">
                    <div className="flex flex-col items-center gap-2">
                      <img
                        src="sunrise.png"
                        alt="Sunrise"
                        className="w-10 h-10 mt-2"
                      />
                      <span className="text-xs font-semibold text-black">
                        Sunrise
                      </span>
                      {weather?.daily?.sunrise?.[0] ? (
                        <p className="text-sm text-gray-800">
                          {new Date(
                            weather.daily.sunrise[0]
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-400">
                          Loading sunrise...
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Sunset */}
                  <div className="flex flex-col items-center p-2 rounded-lg shadow-md max-w-[200px]">
                    <div className="flex flex-col items-center gap-2">
                      <img
                        src="sunset.png"
                        alt="Sunset"
                        className="w-10 h-10 mt-2"
                      />
                      <span className="text-xs font-semibold text-black">
                        Sunset
                      </span>
                      {weather?.daily?.sunset?.[0] ? (
                        <p className="text-sm text-gray-800">
                          {new Date(weather.daily.sunset[0]).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-400">
                          Sunset time loading...
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Radiation */}
                  <div className="flex flex-col items-center p-2 rounded-lg shadow-md max-w-[200px]">
                    <div className="flex flex-col items-center gap-2">
                      <WiDaySunny className="text-yellow-500 w-10 h-10 mt-2" />
                      <span className="text-xs font-semibold text-black">
                        Radiation
                      </span>
                      <p className="text-sm text-gray-800 mt-[-8px]">
                        {weather?.daily?.shortwave_radiation_sum?.[0] !==
                        undefined
                          ? `${weather.daily.shortwave_radiation_sum[0]}`
                          : "Loading..."}
                        &#160;W/m²
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Div
              title="Plant Resources Power Comparison And Solar Efficiency"
              height={"34vh"}
              length="w-full lg:w-[68.5%] md:w-full border-t-[5px] border-[#1f5897]"
            >
              <br></br>
              <h4 className="text-[0.7vw] float-right">
                <div className="flex justify-between items-center mb-2 ">
                  <div className="flex gap-4 items-center text-[0.7vw]">
                    <div className="flex items-center">
                      <label htmlFor="p_startDate" className="mr-2">
                        Start Date:
                      </label>
                      <input
                        type="date"
                        id="p_startDate"
                        name="startDate"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="px-2 py-1 text-[0.7vw] border border-gray-300 rounded-md mr-4 w-[120px]"
                      />
                    </div>
                    <div className="flex items-center">
                      <label htmlFor="p_endDate" className="mr-2">
                        End Date:
                      </label>
                      <input
                        type="date"
                        id="p_endDate"
                        name="endDate"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="px-2 py-1 text-[0.7vw] border border-gray-300 rounded-md mr-4 w-[120px]"
                      />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2 items-center">
                      <button
                        className={`px-3 py-1 text-[0.7vw] bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none ${
                          timePeriod === "hourly" ? "bg-green-600" : ""
                        }`}
                        onClick={() => setTimePeriod("hourly")}
                      >
                        Hourly
                      </button>
                      <button
                        className={`px-3 py-1 text-[0.7vw] bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none ${
                          timePeriod === "daily" ? "bg-blue-600" : ""
                        }`}
                        onClick={() => setTimePeriod("daily")}
                      >
                        Daily
                      </button>
                      <button
                        className={`px-3 py-1 text-[0.7vw] bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none ${
                          timePeriod === "monthly" ? "bg-orange-600" : ""
                        }`}
                        onClick={() => setTimePeriod("monthly")}
                      >
                        Monthly
                      </button>
                    </div>
                  </div>
                </div>
              </h4>

              {/* The original chart container */}
              <div id="productionChart" className="w-full h-[90%] mt-4 "></div>
            </Div>
          </div>
          <div
            className={`transition-all duration-300 shadow-md rounded-md overflow-hidden ${
              expanded
                ? "absolute top-0 left-0 w-full h-screen z-[999] border-t-[5px] border-[rgb(94,140,192)] p-6  "
                : "relative w-full max-w-[92%] sm:max-w-[73%] md:max-w-[64%] lg:max-w-[59%] xl:max-w-[49%] h-[30vh] border-t-[5px] border-[rgb(94,140,192)] p-4"
            }`}
          >
            {/* Background Layer */}
            <div
              className="absolute inset-0 bg-white"
              style={{ opacity: 100 }}
            ></div>

            {/* Foreground Content */}
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <h3 className="text-md font-bold text-gray-700">
                  {selectedCategory}
                </h3>
                <div className="flex space-x-2 mt-[-8px]">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-[160px] text-gray-600 text-sm bg-white border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Solar Generation">Solar Generation</option>
                    <option value="FESCO">FESCO</option>
                    <option value="Genset">Genset</option>
                  </select>
                  <select
                    value={selectedTimePeriod}
                    onChange={(e) => setSelectedTimePeriod(e.target.value)}
                    className="w-[160px] text-gray-600 text-sm bg-white border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="month">This Month over Last Month</option>
                    <option value="week">This Week over Last Week</option>
                    <option value="today">Today over Yesterday</option>
                    <option value="year">This Year over Last Year</option>
                  </select>

                  {/* Expand Button */}
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="p-1 font-bold text-[20px]"
                    title={expanded ? "Minimize" : "Maximize"}
                  >
                    {expanded ? "⛶" : "⛶"}
                  </button>
                </div>
              </div>

              {/* Chart Container */}
              <div className="relative w-full h-full">
                {(loading2 || error2) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-10">
                    {loading2 && (
                      <p className="text-gray-500 text-lg mt-[-80px]">
                        Loading...
                      </p>
                    )}
                    {error1 && <p className="text-red-500 text-lg">{error2}</p>}
                  </div>
                )}
                <div id="chartdiv4" className="w-full h-full mt-[18px]"></div>
              </div>
            </div>
          </div>

          <div
            className={`transition-all duration-300 shadow-md rounded-md border-t-[5px] border-[rgb(94,140,192)] ${
              expandedCards?.airConsumption1
                ? "fixed top-0 left-0 w-full h-screen z-[999] p-6 bg-white overflow-auto"
                : "relative w-full sm:w-[74%] md:w-[64%] lg:w-[60%] xl:w-[50%] h-[30vh] overflow-hidden"
            }`}
          >
            {/* Background Layer */}
            <div
              className="absolute inset-0 bg-white"
              style={{ opacity: 100 }}
            ></div>

            {/* Foreground Content */}
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="flex justify-between items-center px-2 py-1">
                <h3 className="text-md font-bold text-gray-700 truncate">
                  Total Generation
                </h3>

                <div className="flex items-center space-x-2">
                  <select
                    id="timePeriod"
                    className="w-[160px] text-gray-600 text-sm bg-white border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    value={selectedPeriod}
                  >
                    <option value="month">This Month over Last Month</option>
                    <option value="week">This Week over Last Week</option>
                    <option value="today">Today over Yesterday</option>
                    <option value="year">This Year over Last Year</option>
                  </select>

                  <button
                    onClick={() => toggleExpand("airConsumption1")}
                    className="p-1 font-bold text-[20px]"
                    title={
                      expandedCards?.airConsumption1 ? "Minimize" : "Maximize"
                    }
                  >
                    {expandedCards?.airConsumption1 ? "⛶" : "⛶"}
                  </button>
                </div>
              </div>

              <div className="relative w-full h-[90%]">
                {(loading1 || error1) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-10">
                    {loading1 && (
                      <p className="text-gray-500 text-lg mt-[-80px]">
                        Loading...
                      </p>
                    )}
                    {error1 && <p className="text-red-500 text-lg">{error1}</p>}
                  </div>
                )}
                <div id="chartdiv5" className="w-full h-full mt-[15px]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default DashboardPage;
