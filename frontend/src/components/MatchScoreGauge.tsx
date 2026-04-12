"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { getScoreColor, getScoreBgColor } from "@/lib/utils";
import { getScoreLabel } from "@/lib/constants";

// ──────────────────────────────────────────────────────────────
// Match Score Gauge — Animated circular score visualisation
// ──────────────────────────────────────────────────────────────

interface MatchScoreGaugeProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

const sizeConfig = {
  sm: { width: 100, stroke: 6, fontSize: "text-xl" },
  md: { width: 160, stroke: 8, fontSize: "text-3xl" },
  lg: { width: 200, stroke: 10, fontSize: "text-4xl" },
};

export function MatchScoreGauge({ score, size = "md" }: MatchScoreGaugeProps) {
  const config = sizeConfig[size];
  const radius = (config.width - config.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = ((100 - score) / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className={cn("relative", `w-[${config.width}px] h-[${config.width}px]`)}>
        <svg
          width={config.width}
          height={config.width}
          className="transform -rotate-90"
        >
          {/* Background ring */}
          <circle
            cx={config.width / 2}
            cy={config.width / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={config.stroke}
          />
          {/* Progress ring */}
          <circle
            cx={config.width / 2}
            cy={config.width / 2}
            r={radius}
            fill="none"
            stroke="url(#scoreGradient)"
            strokeWidth={config.stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={progress}
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop
                offset="0%"
                stopColor={score >= 60 ? "#8b5cf6" : "#ef4444"}
              />
              <stop
                offset="100%"
                stopColor={score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444"}
              />
            </linearGradient>
          </defs>
        </svg>
        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-bold", config.fontSize, getScoreColor(score))}>
            {Math.round(score)}
          </span>
          <span className="text-xs text-gray-500 mt-0.5">/ 100</span>
        </div>
      </div>

      {/* Label */}
      <span
        className={cn(
          "text-sm font-medium px-3 py-1 rounded-full",
          getScoreBgColor(score),
          getScoreColor(score)
        )}
      >
        {getScoreLabel(score)}
      </span>
    </div>
  );
}
