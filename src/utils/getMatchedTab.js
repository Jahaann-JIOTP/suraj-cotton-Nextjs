// import { menuItems } from "@/constants/menuItems";
import { privilegeConfig } from "@/constant/navigation";

export const getMatchedTab = (currentPath) => {
  return privilegeConfig.find((item) =>
    item.matchPaths.some((path) => {
      if (path instanceof RegExp) return path.test(currentPath);
      return currentPath === path;
    })
  );
};
