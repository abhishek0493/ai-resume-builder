"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDate, getScoreColor } from "@/lib/utils";
import { AnalysisResult } from "@/types";

// ──────────────────────────────────────────────────────────────
// History Card — Compact analysis result summary for dashboard
// ──────────────────────────────────────────────────────────────

interface HistoryCardProps {
  analysis: AnalysisResult;
}

export function HistoryCard({ analysis }: HistoryCardProps) {
  const scoreColor = getScoreColor(analysis.matchScore);

  return (
    <Link href={`/results/${analysis.id}`}>
      <Card hover className="cursor-pointer group">
        <div className="flex items-center justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-medium truncate group-hover:text-violet-300 transition-colors">
              {analysis.jobDescription.title || "Untitled Position"}
            </h4>
            <p className="text-sm text-gray-500 truncate">
              {analysis.jobDescription.company || "Unknown Company"} •{" "}
              {analysis.resume.fileName}
            </p>
          </div>

          <div className="flex-shrink-0 ml-4 text-right">
            <span className={`text-2xl font-bold ${scoreColor}`}>
              {Math.round(analysis.matchScore)}%
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-1.5 flex-wrap">
            {analysis.missingSkills.slice(0, 3).map((skill, idx) => (
              <Badge key={idx} variant="danger">
                {skill}
              </Badge>
            ))}
            {analysis.missingSkills.length > 3 && (
              <Badge variant="default">
                +{analysis.missingSkills.length - 3} more
              </Badge>
            )}
          </div>

          <span className="text-xs text-gray-600 flex-shrink-0 ml-2">
            {formatDate(analysis.createdAt)}
          </span>
        </div>

        {/* Generated content indicators */}
        {analysis.generatedContent && (
          <div className="flex gap-2 mt-3 pt-3 border-t border-white/5">
            {analysis.generatedContent.coverLetter && (
              <Badge variant="info">Cover Letter ✓</Badge>
            )}
            {analysis.generatedContent.generatedResume && (
              <Badge variant="success">Tailored Resume ✓</Badge>
            )}
          </div>
        )}
      </Card>
    </Link>
  );
}
