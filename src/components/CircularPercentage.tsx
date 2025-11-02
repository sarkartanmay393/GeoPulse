import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { hasMoreThanOneDecimalPlaces } from "~/lib/utils";

interface CircularPercentageProps {
  percentage: number;
}

const CircularPercentage: React.FC<CircularPercentageProps> = ({ percentage }) => {
  const hasMoreThanOne = hasMoreThanOneDecimalPlaces(percentage);

  const getColor = (percentage: number) => {
    if (percentage >= 85) return "#10b981"; // emerald-500
    if (percentage >= 70) return "#3b82f6"; // blue-500
    if (percentage >= 50) return "#f59e0b"; // amber-500
    return "#ef4444"; // red-500
  };

  return (
    <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center flex-shrink-0">
      <CircularProgressbar
        value={hasMoreThanOne ? Number(percentage.toFixed(2)) : percentage}
        text={`${hasMoreThanOne ? percentage.toFixed(2) : percentage}%`}
        styles={buildStyles({
          textColor: getColor(percentage),
          pathColor: getColor(percentage),
          trailColor: "#e5e7eb",
          textSize: hasMoreThanOne ? "18px" : "22px",
          pathTransitionDuration: 0.5,
        })}
        className="font-bold"
      />
    </div>
  );
};

export default CircularPercentage;
