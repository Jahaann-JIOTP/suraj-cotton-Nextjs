import { privilegeConfig } from "@/constant/navigation";

// Utility function to determine the active tab based on current pathname
export const getActiveTabFromPathname = (pathname) => {
  for (const [key, config] of Object.entries(privilegeConfig)) {
    if (config.matchPaths.includes(pathname)) {
      return config.tab;
    }
  }
  // Default to first tab if no match found
  return "Home";
};

// Utility function to check if a path matches any of the config paths
export const isPathActive = (pathname, matchPaths) => {
  return matchPaths.includes(pathname);
};

// import { privilegeConfig } from "@/constant/navigation";

// export function getActiveTabFromPathname(pathname) {
//   for (const key in privilegeConfig) {
//     const { matchPaths, tab } = privilegeConfig[key];

//     if (
//       matchPaths &&
//       matchPaths.some((matchPath) => pathname.startsWith(matchPath))
//     ) {
//       return tab;
//     }
//   }

//   return "";
// }
