import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { hasMoreThanOneDecimalPlaces } from "~/lib/utils";
import { getScoreTone } from "~/lib/scoreTone";

interface CircularPercentageProps {
  percentage: number;
}

const CircularPercentage: React.FC<CircularPercentageProps> = ({ percentage }) => {
  const hasMoreThanOne = hasMoreThanOneDecimalPlaces(percentage);
  const tone = getScoreTone(percentage);

  return (
    <div className="w-[44px] h-[44px] flex items-center justify-center">
      <CircularProgressbar
        value={hasMoreThanOne ? Number(percentage.toFixed(2)) : percentage}
        text={`${hasMoreThanOne ? percentage.toFixed(2) : percentage}%`}
        styles={buildStyles({
          textColor: tone.hex,
          pathColor: tone.hex,
          trailColor: "#d6d6d6",
          textSize: hasMoreThanOne ? "19px" : "24px",
        })}
        className="font-bold"
      />
    </div>
  );
};

export default CircularPercentage;
