const config = {
  BASE_URL: process.env.NEXT_PUBLIC_SURAJ_COTTON_BASE_URL,
  // BASE_URL: "https://surajapi.jiotp.com",

  AUTH: {
    LOGIN: "/auth/login",
  },
  USER: {
    ADD_USER: "/users/addUser",
    PROFILE: "/users/myprofile",
    ALL_USERS: "/users/allUsers",
    DELETE_USER: "/users/delete/:id", //replace :id with actual id
    UPDATE_USER: "/users/update/:id",
  },
  PRIVILEGES: {
    GET_ALL_PRIVILEGES: "/privelleges/allprivelleges",
  },
  ROLES: {
    ADD_ROLE: "/roles/addrole",
    GET_ALL_ROLLS: "/roles/allrole",
    UPDATE_ROLE: "/roles/updaterole/:id",
    DELETE_ROLE: "/roles/deleterole/:id",
  },
  ADMIN: {
    DELETE_USER: "/users/delete/:id", //replace :id with actual id
    UPDATE_USER: "/users/update/:id", //replace id
  },
  DASHBOARD: {
    SINGLE_VALUE_DIV: "/energy/consumption", // add start and endDate in query
    GET_GENERATION_ENERGY: "/generation-energy?value=", // pass query parameter
    GET_CONSUMPTION_ENERGY: "/consumption-energy?value=",
    GET_ENERGY_COMPARISON: "/pie-chart/chart-data",
    GET_HEAT_MAP_DATA: "/heat-map",
    GET_SPINDLES: "/energy-spindle",
  },
  SANKEY: {
    UNIT4_LT1: "/unit4-lt1",
    UNIT4_LT2: "/unit4-lt2",
    UNIT5_LT3: "/unit5-lt3",
    UNIT5_LT4: "/unit5-lt4",
  },
  DIAGRAM: {
    MAIN_METER_TAGS_LINK: "/node-red-link",
    METER_DATA: "/meter-data",
    LOGS_DATA: "/logs_data",
  },
  TRENDS: "/trends",
  ALARMS: {
    GET_ALARMS: "/alarms",
    BELL: "/bell",
    ACKNOWLEDGE: "/bell/acknowledge",
  },
  REPORTS: {
    ENERGY_COST_REPORTS: "/energy-cost",
    ENERGY_USAGE_REPORTS: "/energy-usage-report",
    ADD_SPINDLES: "/production",
    GET_SPINDLES: "/production-monthwise?month=",
  },
  METER_CONFIG: {
    ADD_METER_TOGGLE: "/meter/toggle",
    GET_METER_LOGS: "/meter/config/latest",
    GET_METER_TOGGLE_STATUS: "/meter/toggles",
  },
};

export default config;
