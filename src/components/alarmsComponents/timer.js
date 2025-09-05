'use client';
import React, { useEffect, useState } from 'react';

const TimerComponent = ({ onTimerFinish }) => {
  const [timer, setTimer] = useState(40);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimer((prev) => {
        const newTimer = prev === 0 ? 40 : prev - 1;
        if (newTimer === 0 && onTimerFinish) {
          onTimerFinish();  // Call the callback to refresh the API when the timer hits 0
        }
        return newTimer;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [onTimerFinish]);

  return (
    <div>
      <span>Updating: {timer > 9 ? `0:${timer}` : `0:0${timer}`}</span>
    </div>
  );
};

export default TimerComponent;