"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { MatchScoreGauge } from "@/components/MatchScoreGauge";
import { SkillsGap } from "@/components/SkillsGap";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import * as api from "@/services/api";
import { AnalysisResult } from "@/types";
import Link from "next/link";

// ──────────────────────────────────────────────────────────────
// Results Page — Full analysis detail view
// ──────────────────────────────────────────────────────────────

export default function ResultsPage() {
  const params = useParams();
  const id = params.id as string;

  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchResult() {
      try {
        // Fetch from history and find this specific result
        const res = await api.getHistory();
        if (res.data) {
          const found = res.data.find((a) => a.id === id);
          if (found) {
            setAnalysis(found);
          } else {
            setError("Analysis result not found");
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load result");
      } finally {
        setIsLoading(false);
      }
    }
    fetchResult();
  }, [id]);

  const handleGenerateCoverLetter = async () => {
    if (!analysis) return;
    setIsGenerating("cover-letter");
    try {
      const res = await api.generateCoverLetter({ analysisResultId: analysis.id });
      if (res.data) {
        setAnalysis((prev) =>
          prev ? { ...prev, generatedContent: { ...prev.generatedContent, ...res.data, id: res.data!.id, createdAt: res.data!.createdAt } } : prev
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setIsGenerating(null);
    }
  };

  const handleGenerateResume = async () => {
    if (!analysis) return;
    setIsGenerating("resume");
    try {
      const res = await api.generateTailoredResume({ analysisResultId: analysis.id });
      if (res.data) {
        setAnalysis((prev) =>
          prev ? { ...prev, generatedContent: { ...prev.generatedContent, ...res.data, id: res.data!.id, createdAt: res.data!.createdAt } } : prev
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setIsGenerating(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <Card className="text-center py-16">
        <div className="text-5xl mb-4">❌</div>
        <h3 className="text-xl font-semibold text-white mb-2">
          {error || "Result Not Found"}
        </h3>
        <Link
          href="/dashboard"
          className="text-violet-400 hover:text-violet-300 text-sm mt-4 inline-block"
        >
          ← Back to Dashboard
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/dashboard"
            className="text-sm text-gray-500 hover:text-gray-300 transition-colors mb-2 inline-block"
          >
            ← Dashboard
          </Link>
          <h1 className="text-3xl font-bold">
            {analysis.jobDescription.title || "Analysis Result"}
          </h1>
          <p className="text-gray-400">
            {analysis.jobDescription.company || "Unknown Company"} •{" "}
            {analysis.resume.fileName}
          </p>
        </div>
      </div>

      {/* Score + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="flex justify-center">
          <MatchScoreGauge score={analysis.matchScore} size="lg" />
        </div>
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>📊 Analysis Summary</CardTitle>
            </CardHeader>
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
              {analysis.summary}
            </p>
          </Card>
        </div>
      </div>

      {/* Skills Gap */}
      <SkillsGap
        missingSkills={analysis.missingSkills}
        recommendations={analysis.recommendations}
      />

      {/* Generation */}
      <Card>
        <CardHeader>
          <CardTitle>🚀 Generate Content</CardTitle>
          <CardDescription>
            Use AI to create tailored content based on this analysis
          </CardDescription>
        </CardHeader>
        <div className="flex flex-wrap gap-4">
          <Button
            onClick={handleGenerateCoverLetter}
            isLoading={isGenerating === "cover-letter"}
            variant="secondary"
          >
            ✉️ {analysis.generatedContent?.coverLetter ? "Regenerate" : "Generate"} Cover Letter
          </Button>
          <Button
            onClick={handleGenerateResume}
            isLoading={isGenerating === "resume"}
            variant="secondary"
          >
            📝 {analysis.generatedContent?.generatedResume ? "Regenerate" : "Generate"} Tailored Resume
          </Button>
        </div>
      </Card>

      {/* Generated Cover Letter */}
      {analysis.generatedContent?.coverLetter && (
        <Card>
          <CardHeader>
            <CardTitle>✉️ Cover Letter</CardTitle>
          </CardHeader>
          <div className="bg-white/5 rounded-xl p-6 text-gray-300 text-sm leading-relaxed whitespace-pre-line">
            {analysis.generatedContent.coverLetter}
          </div>
        </Card>
      )}

      {/* Generated Tailored Resume */}
      {analysis.generatedContent?.generatedResume && (
        <Card>
          <CardHeader>
            <CardTitle>📝 Tailored Resume</CardTitle>
          </CardHeader>
          <div className="bg-white/5 rounded-xl p-6 text-gray-300 text-sm leading-relaxed whitespace-pre-line font-mono">
            {analysis.generatedContent.generatedResume}
          </div>
        </Card>
      )}
    </div>
  );
}
