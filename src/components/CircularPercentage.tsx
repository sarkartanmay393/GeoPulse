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
    if (percentage < 40) {
      return "#FF0000"; // Red for <40%
    } else if (percentage < 80) {
      return "#FFA500"; // Yellow for <80%
    } else {
      return "#2fee19"; // Green for >=80%
    }
  };

  return (
    <div className="w-[44px] h-[44px] flex items-center justify-center">
      <CircularProgressbar
        value={hasMoreThanOne ? Number(percentage.toFixed(2)) : percentage}
        text={`${hasMoreThanOne ? percentage.toFixed(2) : percentage}%`}
        styles={buildStyles({
          textColor: getColor(percentage),
          pathColor: getColor(percentage),
          trailColor: "#d6d6d6",
          textSize: hasMoreThanOne ? "19px" : "24px",
        })}
        className="font-bold"
      />
    </div>
  );
};

export default CircularPercentage;
