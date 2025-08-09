import CustomLoader from "@/components/customLoader/CustomLoader";

export default function Loading() {
  return (
    // <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-800 z-50">
    //   <div className="w-12 h-12 border-4 border-[#1F5897]  border-t-transparent rounded-full animate-spin"></div>
    // </div>
    <div className="absolute bg-white dark:bg-gray-800 top-0 left-0 flex items-center justify-center w-full h-screen">
      <CustomLoader />
    </div>
  );
}
