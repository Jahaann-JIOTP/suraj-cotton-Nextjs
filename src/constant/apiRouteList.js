const config = {
  SURAJ_COTTON_BASE_URL: "http://localhost:5035",
  // SURAJ_COTTON_BASE_URL: "http://3.7.12.126:5035",
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  AUTH: {
    LOGIN: "/auth/login",
  },
  USER: {
    PROFILE: "/users/profile",
  },
  ADMIN: {
    FETCH_SELECTED_ROLES: "/roles/all?selection=true",
    FETCH_ROLES: "/roles/all",
    ADD_USER: "/users/register",
    GET_USERS: "/users/all",
    DELETE_USER: "/users/delete/:id", //replace :id with actual id
    UPDATE_USER: "/users/update/:id", //replace id
    GET_PRIVILEGES: "/privileges/all",
    ADD_ROLE: "/roles/add",
    UPDATE_ROLE: "/roles/update/:id", // replace id
    DELETE_ROLE: "/roles/delete/:id", // replace id
  },
  ALARMS: {
    GET_ALARMS: "/alarms",
    BELL: "/bell",
    ACKNOWLEDGE: "/bell/acknowledge",
  },
};

export default config;
