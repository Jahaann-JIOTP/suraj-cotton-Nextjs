import {
  faDashboard,
  faGear,
  faProjectDiagram,
  faArrowTrendUp,
  faBell,
  faBookOpen,
} from "@fortawesome/free-solid-svg-icons";

import PowerIcon from "../../public/sidebarIcons/PowerIcon";
import TransformerIcon from "../../public/sidebarIcons/Transformer";
import EnergySankey from "../../public/sidebarIcons/energySankey";
import Unit4Lt1 from "../../public/sidebarIcons/Unit4Lt1";
import PlantOverview from "../../public/sidebarIcons/PlantOverview";
import { GoDotFill } from "react-icons/go";
import { BsFillDiagram3Fill } from "react-icons/bs";

export const privilegeConfig = {
  Dashboard: {
    // href: "/dashboard",
    href: "#",
    icon: faDashboard,
    label: "DASHBOARD",
    matchPaths: ["/dashboard", "/status_table", "/Sanky"],
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
    //href: "/all-alarms",
    href: "#",
    icon: faBell,
    label: "ALARMS",
    matchPaths: ["/all-alarms", "/Recent_Alarms"],
    tab: "Alarms",
  },
  Reports: {
    //href: "/energy-usage-report",
    href: "#",

    icon: faBookOpen,
    label: "REPORTS",
    matchPaths: [
      "/energy-usage-report",
      "/energy-cost-report",
      "/energy_usage",
      "/energy_shift",
      "/spindle-production",
    ],
    tab: "Reports",
  },
  // "User Management": {
  Setting: {
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
  "Setting",
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
          href: "#",
          icon: PlantOverview,
        },
        {
          id: 1,
          title: "Power Summary",
          href: "#",
          icon: PlantOverview,
        },
        {
          id: 2,
          title: "Transformers",
          href: "#",
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
          href: "#",
          icon: Unit4Lt1,
        },
        {
          id: 4,
          title: "Unit 4 LT-2 (Sankey)",
          href: "#",
          icon: Unit4Lt1,
        },
        {
          id: 5,
          title: "Unit 5 LT-3 (Sankey)",
          href: "#",
          icon: Unit4Lt1,
        },
        {
          id: 6,
          title: "Unit 5 LT-4 (Sankey)",
          href: "#",
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
          title: "oneline",
          href: "/sld",
          icon: BsFillDiagram3Fill,
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
      id: 0,
      title: "Alarms",
      icon: TransformerIcon,
      submenu: [
        {
          id: 0,
          title: "All Alarms",
          // href: "/all-alarms",
          href: "#",
          icon: TransformerIcon,
        },
      ],
    },
  ],

  // Reports: [
  //   {
  //     title: "energy-usage-report",
  //     icon: PlantOverview,
  //     // href: "/energy-usage-report",
  //     href: "#",
  //   },
  //   {
  //     title: "Spindle Production",
  //     icon: PlantOverview,
  //     // href: "/spindle-production",
  //     href: "#",
  //   },
  // ],

  // Reportss: [
  //   {
  //     title: "energy-usage-report",
  //     icon: PlantOverview,
  //     href: "/energy-usage-report",
  //   },
  //   {
  //     title: "Spindle Production",
  //     icon: PlantOverview,
  //     href: "/spindle-production",
  //   },
  // ],

  Setting: [
    {
      title: "User Management",
      icon: GoDotFill,
      href: "/add_roles",
    },
  ],
};
