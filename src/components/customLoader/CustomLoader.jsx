"use client";

const bars = Array.from({ length: 12 });

export default function CustomLoader() {
  return (
    <div className="w-full h-[60vh] flex items-center justify-center">
      <div className="relative w-[54px] h-[54px] rounded-[10px]">
        {bars.map((_, index) => {
          const rotate = index * 30;
          const delay = -(1.2 - index * 0.1);

          return (
            <div
              key={index}
              className="absolute left-1/2 top-[30%] w-[8%] h-[24%] bg-gray-500 opacity-0 rounded-full shadow-sm animate-fadePulse"
              style={{
                transform: `rotate(${rotate}deg) translate(0, -130%)`,
                animationDelay: `${delay}s`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
