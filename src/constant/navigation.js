import {
  faDashboard,
  faGear,
  faProjectDiagram,
  faArrowTrendUp,
  faBell,
  faBookOpen,
  faRotate,
} from "@fortawesome/free-solid-svg-icons";

import PowerIcon from "../../public/sidebarIcons/PowerIcon";
import TransformerIcon from "../../public/sidebarIcons/Transformer";
import EnergySankey from "../../public/sidebarIcons/energySankey";
import Unit4Lt1 from "../../public/sidebarIcons/Unit4Lt1";
import PlantOverview from "../../public/sidebarIcons/PlantOverview";
import { FaUserCog } from "react-icons/fa";
import { MdElectricMeter } from "react-icons/md";
import { BsFillDiagram3Fill } from "react-icons/bs";
import { MdOutlineSettingsBackupRestore } from "react-icons/md";

export const privilegeConfig = {
  Dashboard: {
    href: "/dashboard",
    icon: faDashboard,
    label: "DASHBOARD",
    matchPaths: [
      "/dashboard",
      "/power-summary",
      "/transformers",
      "/unit-4-lt-1",
      "/unit-4-lt-2",
      "/unit-5-lt-3",
      "/unit-5-lt-4",
    ],
    tab: "Home",
  },
  Diagram: {
    href: "/sld",
    icon: faProjectDiagram,
    label: "DIAGRAM",
    matchPaths: ["/sld", "/meter", "/logs", "/log-detail"],
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
    href: "/all-alarms",
    icon: faBell,
    label: "ALARMS",
    matchPaths: ["/all-alarms", "/Recent_Alarms"],
    tab: "Alarms",
  },
  Reports: {
    href: "/energy-usage-report",
    icon: faBookOpen,
    label: "REPORTS",
    matchPaths: [
      "/energy-usage-report",
      "/energy-cost-report",
      "/energy_usage",
      "/energy-summary-report",
    ],
    tab: "Reports",
  },
  // "User Management": {
  Configuration: {
    href: "/add_roles",
    icon: faGear,
    label: "Configuration",
    matchPaths: ["/add_roles", "/configuration-meter"],
    tab: "Configuration",
  },
  Production: {
    href: "/unit-4-production",
    icon: faRotate,
    label: "Production",
    matchPaths: ["/unit-4-production", "/unit-5-production"],
    tab: "Production",
  },
};

export const privilegeOrder = [
  "Dashboard",
  "Diagram",
  "Trends",
  "Alarms",
  "Reports",
  "Configuration",
  "Production",
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
          title: "Unit 4 LT-1",
          href: "/unit-4-lt-1",
          icon: Unit4Lt1,
        },
        {
          id: 4,
          title: "Unit 4 LT-2",
          href: "/unit-4-lt-2",
          icon: Unit4Lt1,
        },
        {
          id: 5,
          title: "Unit 5 LT-3",
          href: "/unit-5-lt-3",
          icon: Unit4Lt1,
        },
        {
          id: 6,
          title: "Unit 5 LT-4",
          href: "/unit-5-lt-4",
          icon: Unit4Lt1,
        },
      ],
    },
  ],

  Diagram: [
    {
      id: 0,
      title: "Single Line Diagram",
      icon: BsFillDiagram3Fill,
      submenu: [
        {
          id: 0,
          title: "Oneline",
          href: "/sld",
          icon: BsFillDiagram3Fill,
        },
      ],
    },
  ],
  Trends: [
    {
      title: "Customized Trend",
      icon: TransformerIcon,
      href: "/custom_trend",
    },
  ],

  Alarms: [
    {
      id: 0,
      title: "Alarms",
      icon: TransformerIcon,
      submenu: [
        {
          id: 0,
          title: "All Alarms",
          href: "/all-alarms",
          icon: TransformerIcon,
        },
      ],
    },
  ],

  Reports: [
    {
      title: "Energy-usage-report",
      icon: PlantOverview,
      href: "/energy-usage-report",
    },
    {
      title: "Energy Cost Report",
      icon: PlantOverview,
      href: "/energy-cost-report",
    },
    {
      title: "Power Summary Report",
      icon: PlantOverview,
      href: "/energy-summary-report",
    },
  ],

  Configuration: [
    {
      title: "User Configuration",
      icon: FaUserCog,
      href: "/add_roles",
    },
    {
      title: "Meter Configuration",
      icon: MdElectricMeter,
      href: "/configuration-meter",
    },
  ],
  Production: [
    {
      title: "Unit 4",
      icon: MdOutlineSettingsBackupRestore,
      href: "/unit-4-production",
    },
    {
      title: "Unit 5",
      icon: MdOutlineSettingsBackupRestore,
      href: "/unit-5-production",
    },
  ],
};
