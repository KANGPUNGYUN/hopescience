import React from "react";
import { formatCount, useCountUp } from "./useCountUp";

export const HomeTrustedStat = ({ stat, animateEnabled }) => {
  const count = useCountUp(stat.value, {
    duration: 2000,
    enabled: animateEnabled && stat.animate,
  });

  const valueText = stat.animate
    ? `${formatCount(count)}${stat.suffix}`
    : `${stat.display}${stat.suffix}`;

  return (
    <div className="home-trusted__stat">
      <p className="home-trusted__stat-value">{valueText}</p>
      <p className="home-trusted__stat-label">{stat.label}</p>
    </div>
  );
};
