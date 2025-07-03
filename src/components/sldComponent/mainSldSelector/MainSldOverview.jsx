"use client";
import { useRouter } from "next/navigation";

const MainSldOverview = () => {
  const router = useRouter();

  return (
    <div className="w-full">
      <div className="min-w-[1280px] h-[600px] relative mx-auto">
        <img
          src="./main-overview.png"
          alt="Main Overview"
          className="w-[1150px] mx-auto"
        />

        <button
          className="absolute top-[667px] left-[228px] w-[253px] cursor-pointer h-[41px] border border-red-600"
          onClick={() => router.push("/sld?unit=unit5")}
        ></button>

        <button
          className="absolute top-[667px] left-[828px] w-[367px] cursor-pointer h-[41px] border border-red-600"
          onClick={() => router.push("/sld?unit=unit4")}
        ></button>
      </div>
    </div>
  );
};

export default MainSldOverview;
