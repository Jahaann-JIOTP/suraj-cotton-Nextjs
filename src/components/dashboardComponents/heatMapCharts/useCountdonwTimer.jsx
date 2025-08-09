"use client";
import { useEffect, useState } from "react";

export const useMaintenanceCountdown = (initialValue, updatedAt) => {
  // Initialize with 0 if values are invalid
  const [remainingHours, setRemainingHours] = useState(
    Number(initialValue) || 0
  );
  const [lastUpdated, setLastUpdated] = useState(
    updatedAt ? new Date(updatedAt) : new Date()
  );

  useEffect(() => {
    // Only proceed if we have valid numbers/dates
    const numericValue = Number(initialValue);
    if (isNaN(numericValue) || !updatedAt) {
      setRemainingHours(0);
      return;
    }

    const parsedDate = new Date(updatedAt);
    if (isNaN(parsedDate.getTime())) {
      setRemainingHours(0);
      return;
    }

    setLastUpdated(parsedDate);

    const calculateElapsedHours = () => {
      const now = new Date();
      const diffInMs = now.getTime() - parsedDate.getTime();
      return Math.floor(diffInMs / (1000 * 60 * 60)); // Convert ms to hours
    };

    const updateCountdown = () => {
      const elapsedHours = calculateElapsedHours();
      const newRemaining = Math.max(0, numericValue - elapsedHours);
      setRemainingHours(newRemaining);
    };

    // Update immediately
    updateCountdown();

    // Set up interval to update every hour
    const interval = setInterval(() => {
      updateCountdown();
    }, 60 * 60 * 1000); // Update every hour

    return () => clearInterval(interval);
  }, [initialValue, updatedAt]);

  return remainingHours;
};
