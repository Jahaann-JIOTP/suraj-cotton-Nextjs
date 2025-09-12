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
      "/unit-4-lt-1",
      "/unit-4-lt-2",
      "/unit-5-lt-1",
      "/unit-5-lt-2",
      "/dailyconsumption-u4-lt1",
      "/dailyconsumption-u4-lt2",
      "/dailyconsumption-u5-lt1",
      "/dailyconsumption-u5-lt2",
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
    matchPaths: ["/custom_trend", "/trends"],
    tab: "Trends",
  },
  Alarms: {
    href: "/alarm_type_config",
    icon: faBell,
    label: "Alarms",
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
    ],
    tab: "Reports",
  },
  // "User Management": {
  Settings: {
    href: "/add_roles",
    icon: faUsersGear,
    label: "User Management",
    matchPaths: ["/add_roles"],
    tab: "Settings",
  },
  Configuration: {
    href: "/configuration-meter",
    icon: faGear,
    label: "Configuration",
    matchPaths: ["/configuration-meter", "/data-verification"],
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
          title: "Unit 5 LT-1",
          href: "/unit-5-lt-1",
          icon: Unit4Lt1,
        },
        {
          id: 6,
          title: "Unit 5 LT-2",
          href: "/unit-5-lt-2",
          icon: Unit4Lt1,
        },
      ],
    },
    {
      id: 2,
      title: "Daily Consumption",
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
        // {
        //   id: 1,
        //   title: "Trends",
        //   href: "/trends",
        //   icon: AlarmSubMenuIcon,
        // }
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
      title: "Energy Usage Report",
      icon: PlantOverview,
      href: "/energy-usage-report",
    },
    {
      title: "Energy Summary Report",
      icon: PlantOverview,
      href: "/energy-summary-report",
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
