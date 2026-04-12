"use client";

import React from "react";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";

// ──────────────────────────────────────────────────────────────
// Skills Gap — Shows missing skills & recommendations
// ──────────────────────────────────────────────────────────────

interface SkillsGapProps {
  missingSkills: string[];
  recommendations: string[];
}

export function SkillsGap({ missingSkills, recommendations }: SkillsGapProps) {
  return (
    <div className="space-y-6">
      {/* Missing Skills */}
      <Card>
        <CardHeader>
          <CardTitle>🚫 Missing Skills</CardTitle>
          <CardDescription>
            Skills found in the job description but not in your resume
          </CardDescription>
        </CardHeader>

        {missingSkills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {missingSkills.map((skill, idx) => (
              <Badge key={idx} variant="danger">
                {skill}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-emerald-400 text-sm">
            ✨ Great! No major skill gaps detected.
          </p>
        )}
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>💡 Recommendations</CardTitle>
          <CardDescription>
            Actionable suggestions to improve your resume for this role
          </CardDescription>
        </CardHeader>

        {recommendations.length > 0 ? (
          <ul className="space-y-3">
            {recommendations.map((rec, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 text-sm text-gray-300"
              >
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center text-xs font-bold mt-0.5">
                  {idx + 1}
                </span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-sm">
            No specific recommendations at this time.
          </p>
        )}
      </Card>
    </div>
  );
}
