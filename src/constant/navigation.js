import {
  faDashboard,
  faGear,
  faProjectDiagram,
  faArrowTrendUp,
  faBell,
} from "@fortawesome/free-solid-svg-icons";

import PowerIcon from "../../public/sidebarIcons/PowerIcon";
import TransformerIcon from "../../public/sidebarIcons/Transformer";
import EnergySankey from "../../public/sidebarIcons/energySankey";
import Unit4Lt1 from "../../public/sidebarIcons/Unit4Lt1";
import PlantOverview from "../../public/sidebarIcons/PlantOverview";

export const privilegeConfig = {
  Dashboard: {
    href: "/dashboard",
    icon: faDashboard,
    label: "DASHBOARD",
    matchPaths: ["/dashboard", "/status_table", "/Sanky"],
    tab: "Home",
  },
  Diagram: {
    href: "/sld",
    icon: faProjectDiagram,
    label: "DIAGRAM",
    matchPaths: ["/sld", "/sld_meters", "/Logs", "/log_detail"],
    tab: "Diagram",
  },
  Trends: {
    href: "/custom_trend",
    icon: faArrowTrendUp,
    label: "TRENDS",
    matchPaths: ["/custom_trend", "/comparison_trends"],
    tab: "Trends",
  },
  Alarms: {
    href: "/All_Alarms",
    icon: faBell,
    label: "ALARMS",
    matchPaths: ["/alarms", "/All_Alarms", "/Recent_Alarms"],
    tab: "Alarms",
  },
  Reports: {
    href: "/energy_cost",
    icon: faBell,
    label: "REPORTS",
    matchPaths: ["/energy_cost", "/energy_usage", "/energy_shift"],
    tab: "Reports",
  },
  "User Management": {
    href: "/add_roles",
    icon: faGear,
    label: "USER MANAGEMENT",
    matchPaths: ["/add_roles"],
    tab: "Setting",
  },
};

export const privilegeOrder = [
  "Dashboard",
  "Diagram",
  "Trends",
  "Alarms",
  "Reports",
  "User Management",
];

export const sidebarLinksMap = {
  Home: [
    {
      id: 0,
      title: "Plant Summary",
      icon: PowerIcon,
      submenu: [
        {
          id: 0,
          title: "Plant Overview",
          href: "/dashboard",
          icon: PlantOverview,
        },
        {
          id: 1,
          title: "Power Summary",
          href: "/power-summary",
          icon: PlantOverview,
        },
        {
          id: 2,
          title: "Transformers",
          href: "/transformers",
          icon: TransformerIcon,
        },
      ],
    },
    {
      id: 1,
      title: "Energy Sankeys",
      icon: EnergySankey,
      submenu: [
        {
          id: 3,
          title: "Unit 4 LT-1 (Sankey)",
          href: "/unit-4-lt-1",
          icon: Unit4Lt1,
        },
        {
          id: 4,
          title: "Unit 4 LT-2 (Sankey)",
          href: "/unit-4-lt-2",
          icon: Unit4Lt1,
        },
        {
          id: 5,
          title: "Unit 5 LT-3 (Sankey)",
          href: "/unit-5-lt-3",
          icon: Unit4Lt1,
        },
        {
          id: 6,
          title: "Unit 5 LT-4 (Sankey)",
          href: "/unit-5-lt-4",
          icon: Unit4Lt1,
        },
      ],
    },
  ],
  Diagram: [
    {
      id: 0,
      title: "Songle Line Diagram",
      icon: TransformerIcon,
      submenu: [
        {
          id: 0,
          title: "oneline",
          href: "/sld",
          icon: TransformerIcon,
        },
      ],
    },
  ],
  Trends: [
    {
      title: "1- Customized Trend",
      icon: TransformerIcon,
      href: "/custom_trend",
    },
  ],
  Alarms: [
    {
      title: "1- All Alarms",
      icon: TransformerIcon,
      href: "/All_Alarms",
    },
    {
      title: "2- Recent Alarms",
      icon: TransformerIcon,
      href: "/Recent_Alarms",
    },
    {
      title: "3- Alarms Threshold",
      icon: TransformerIcon,
      href: "/alarms_threshold",
    },
  ],
  Reports: [
    {
      title: "1- Energy Cost Report",
      icon: TransformerIcon,
      href: "/energy_cost",
    },
    {
      title: "2- Energy Usage Report",
      icon: TransformerIcon,
      href: "/energy_usage",
    },
  ],
  Setting: [
    {
      title: "1- User Management",
      icon: TransformerIcon,
      href: "/add_roles",
    },
  ],
};
