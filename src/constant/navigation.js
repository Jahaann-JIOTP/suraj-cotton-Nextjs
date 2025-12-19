import {
  faDashboard,
  faGear,
  faProjectDiagram,
  faArrowTrendUp,
  faBell,
  faBookOpen,
  faRotate,
  faUsersGear,
} from "@fortawesome/free-solid-svg-icons";
import AlarmBellIcon from "../../public/sidebarIcons/AlarmBell";
import ListIcon from "../../public/sidebarIcons/ListIcon";
import AlarmSubMenuIcon from "../../public/sidebarIcons/AlarmSubmenu";
import MeterIcon from "../../public/sidebarIcons/MeterIcon";
import PowerIcon from "../../public/sidebarIcons/PowerIcon";
import TransformerIcon from "../../public/sidebarIcons/Transformer";
import EnergySankey from "../../public/sidebarIcons/energySankey";
import Unit4Lt1 from "../../public/sidebarIcons/Unit4Lt1";
import PlantOverview from "../../public/sidebarIcons/PlantOverview";
import { FaUserCog } from "react-icons/fa";
import { MdElectricMeter, MdOutlineVerified } from "react-icons/md";
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
      "/main-sankey",
      "/unit4-sankey",
      "/unit5-sankey",
      "/unit-4-lt-1",
      "/unit-4-lt-2",
      "/unit-5-lt-1",
      "/unit-5-lt-2",
      "/dailyconsumption-u4-lt1",
      "/dailyconsumption-u4-lt2",
      "/dailyconsumption-u5-lt1",
      "/dailyconsumption-u5-lt2",
      "/cockpit",
    ],
    tab: "Home",
  },
  Diagram: {
    href: "/sld",
    icon: faProjectDiagram,
    label: "DIAGRAM",
    matchPaths: ["/sld", "/meter", "/logs", "/log-detail", "/field-meters"],
    tab: "Diagram",
  },
  Trends: {
    href: "/custom_trend",
    icon: faArrowTrendUp,
    label: "TRENDS",
    matchPaths: [
      "/custom_trend",
      "/trend-plants",
      "/trend-u4-lt1",
      "/trend-u4-lt2",
      "/trend-u5-lt1",
      "/trend-u5-lt2",
      "/trafo-losses",
    ],
    tab: "Trends",
  },
  Alarms: {
    href: "/alarm_type_config",
    // href: "/active_alarms",
    icon: faBell,
    label: "ALARMS",
    tab: "Alarms",
    matchPaths: [
      "/alarm_config",
      "/alarm_type_config",
      "/alarm_config_type",
      "/alarms",
      "/active_alarms",
      "/alarm",
      "/alarms_details",
    ],
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
      "/energy-comparison-report",
      "/department-wise-report",
      "/analytics-report",
      "/harmonics-detail-report",
    ],
    tab: "Reports",
  },
  // "User Management": {
  Settings: {
    href: "/add_roles",
    icon: faUsersGear,
    label: "USER MANAGEMENT",
    matchPaths: ["/add_roles"],
    tab: "Settings",
  },
  Configuration: {
    href: "/configuration-meter",
    icon: faGear,
    label: "CONFIGURATION",
    matchPaths: ["/configuration-meter", "/data-verification"],
    tab: "Configuration",
  },
  Production: {
    href: "/unit-4-production",
    icon: faRotate,
    label: "PRODUCTION",
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
  "Settings",
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
          title: "Cockpit",
          href: "/cockpit",
          icon: MeterIcon,
        },
        {
          id: 3,
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
          id: 0,
          title: "Main",
          href: "/main-sankey",
          icon: Unit4Lt1,
        },
        {
          id: 1,
          title: "Unit 4",
          href: "/unit4-sankey",
          icon: Unit4Lt1,
        },
        {
          id: 2,
          title: "Unit 5",
          href: "/unit5-sankey",
          icon: Unit4Lt1,
        },
        // {
        //   id: 3,
        //   title: "Losses",
        //   href: "/losses-sankey",
        //   icon: Unit4Lt1,
        // },
        {
          id: 4,
          title: "Unit 4 LT-1",
          href: "/unit-4-lt-1",
          icon: Unit4Lt1,
        },
        {
          id: 5,
          title: "Unit 4 LT-2",
          href: "/unit-4-lt-2",
          icon: Unit4Lt1,
        },
        {
          id: 6,
          title: "Unit 5 LT-1",
          href: "/unit-5-lt-1",
          icon: Unit4Lt1,
        },
        {
          id: 7,
          title: "Unit 5 LT-2",
          href: "/unit-5-lt-2",
          icon: Unit4Lt1,
        },
      ],
    },
    {
      id: 2,
      title: "Consumption Summary",
      icon: EnergySankey,
      submenu: [
        {
          id: 7,
          title: "Unit 4 LT-1",
          href: "/dailyconsumption-u4-lt1",
          icon: Unit4Lt1,
        },
        {
          id: 8,
          title: "Unit 4 LT-2",
          href: "/dailyconsumption-u4-lt2",
          icon: Unit4Lt1,
        },
        {
          id: 9,
          title: "Unit 5 LT-1",
          href: "/dailyconsumption-u5-lt1",
          icon: Unit4Lt1,
        },
        {
          id: 10,
          title: "Unit 5 LT-2",
          href: "/dailyconsumption-u5-lt2",
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
        {
          id: 1,
          title: "Field Meters",
          href: "/field-meters",
          icon: BsFillDiagram3Fill,
        },
        // {
        //   id: 2,
        //   title: "New Field Meters",
        //   href: "/new-field-meter",
        //   icon: BsFillDiagram3Fill,
        // },
      ],
    },
  ],
  Trends: [
    {
      id: 0,
      title: "Trends",
      icon: TransformerIcon,
      submenu: [
        {
          id: 0,
          title: "Custom Trend",
          href: "/custom_trend",
          icon: AlarmSubMenuIcon,
        },
        {
          id: 1,
          title: "Plants",
          href: "/trend-plants",
          icon: AlarmSubMenuIcon,
        },
        {
          id: 2,
          title: "Unit 4 LT 1",
          href: "/trend-u4-lt1",
          icon: AlarmSubMenuIcon,
        },
        {
          id: 3,
          title: "Unit 4 LT 2",
          href: "/trend-u4-lt2",
          icon: AlarmSubMenuIcon,
        },
        {
          id: 4,
          title: "Unit 5 LT 1",
          href: "/trend-u5-lt1",
          icon: AlarmSubMenuIcon,
        },
        {
          id: 5,
          title: "Unit 5 LT 2",
          href: "/trend-u5-lt2",
          icon: AlarmSubMenuIcon,
        },
        {
          id: 6,
          title: "Tansformer Losses",
          href: "/trafo-losses",
          icon: TransformerIcon,
        },
      ],
    },
  ],
  Alarms: [
    {
      id: 0,
      title: "Alarm Setup",
      icon: AlarmBellIcon,
      matchPaths: [
        "/alarm_config",
        "/alarm_type_config",
        "/alarm_config_type",
        "/alarms",
      ],
      submenu: [
        {
          id: 0,
          title: "Alarm Config.",
          href: "/alarm_type_config",
          icon: AlarmSubMenuIcon,
        },
      ],
    },
    {
      id: 1,
      title: "Alarm Details",
      icon: AlarmBellIcon,
      submenu: [
        {
          id: 0,
          title: "Active Alarms",
          href: "/active_alarms",
          icon: AlarmSubMenuIcon,
        },
        {
          id: 1,
          title: "All Alarms",
          href: "/alarms_details?type=All",
          icon: AlarmSubMenuIcon,
        },
        {
          id: 2,
          title: "Recent Alarms",
          href: "/alarms_details?type=Recent",
          icon: AlarmSubMenuIcon,
        },
        {
          id: 3,
          title: "Unacknowledged Alarms",
          href: "/alarms_details?type=Unacknowledged",
          icon: AlarmSubMenuIcon,
        },
      ],
    },
  ],
  Reports: [
    {
      id: 1,
      title: "Consumption Report",
      icon: PlantOverview,
      submenu: [
        {
          id: 0,
          title: "Energy Usage Report",
          icon: PlantOverview,
          href: "/energy-usage-report",
        },
        {
          id: 1,
          title: "Energy Comparison Report",
          icon: PlantOverview,
          href: "/energy-comparison-report",
        },
        {
          id: 2,
          title: "Department-Wise Report",
          icon: PlantOverview,
          href: "/department-wise-report",
        },
      ],
    },
    {
      id: 2,
      title: "Harmonics Report",
      icon: PlantOverview,
      submenu: [
        {
          id: 0,
          title: "Harmonics Analytics Report",
          icon: PlantOverview,
          href: "/analytics-report",
        },
        {
          id: 1,
          title: "Harmonic Detail Report",
          icon: PlantOverview,
          href: "/harmonics-detail-report",
        },
      ],
    },
  ],
  Settings: [
    {
      title: "User Configuration",
      icon: FaUserCog,
      href: "/add_roles",
    },
  ],
  Configuration: [
    {
      title: "Meter Configuration",
      icon: MdElectricMeter,
      href: "/configuration-meter",
    },
    {
      title: "Data Verification",
      icon: MdOutlineVerified,
      href: "/data-verification",
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
