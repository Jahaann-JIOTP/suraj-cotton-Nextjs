import { MdOutlineFullscreen, MdOutlineFullscreenExit } from "react-icons/md"

export const ChartCard = ({id,title, chartId,area, ChartComponent, state, onChange})=>{
    return(
    <div
    className={`w-full p-4 ${
      state.fullscreen ? "absolute top-0 left-0 z-50 h-screen" : "relative"
    } bg-white dark:bg-gray-800 border-t-4 border-[#1F5897] rounded-[12px] shadow-md`}
  >
    <div className="mb-2 flex items-center justify-between">
      <span className="text-[15px] font-inter font-semibold uppercase text-[#4F5562] dark:text-white font-raleway">
        {title}
      </span>

      <div className="flex items-center gap-2">
        {/* Date Pickers */}
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium dark:text-gray-300">Interval:</span>
          <input
            type="date"
            value={state.start}
            onChange={(e) => onChange(id, "start", e.target.value)}
            className="border rounded px-1 py-0.5 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
          <span className="dark:text-gray-300">to</span>
          <input
            type="date"
            value={state.end}
            min={state.start}
            onChange={(e) => onChange(id, "end", e.target.value)}
            className="border rounded px-1 py-0.5 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>

        {/* Fullscreen Button */}
        <button
          onClick={() => onChange(id, "fullscreen", !state.fullscreen)}
          className="p-1 text-gray-600 cursor-pointer dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        >
          {state.fullscreen ? (
            <MdOutlineFullscreenExit size={20} />
          ) : (
            <MdOutlineFullscreen size={20} />
          )}
        </button>
      </div>
    </div>

    {/* Chart Component */}
    <ChartComponent
      startDate={state.start}
      endDate={state.end}
      isFullscreen={state.fullscreen}
      area={area}
      chartId={chartId}
    />
  </div>
  )}