"use client";

import React, { useState } from "react";
import { ResumeUploader } from "@/components/ResumeUploader";
import { JDInput } from "@/components/JDInput";
import { MatchScoreGauge } from "@/components/MatchScoreGauge";
import { SkillsGap } from "@/components/SkillsGap";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import * as api from "@/services/api";
import { AnalysisResult, Resume } from "@/types";

// ──────────────────────────────────────────────────────────────
// Analyze Page — Two-step flow: Upload Resume → Analyze vs JD
// ──────────────────────────────────────────────────────────────

export default function AnalyzePage() {
  const [resume, setResume] = useState<Resume | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState<string | null>(null);
  const [generatedResume, setGeneratedResume] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Upload resume
  const handleUploadResume = async (resumeText: string, fileName: string) => {
    setError(null);
    setIsUploading(true);
    try {
      const res = await api.uploadResume({ resumeText, fileName });
      if (res.data) setResume(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload resume");
    } finally {
      setIsUploading(false);
    }
  };

  // Step 2: Analyze against JD
  const handleAnalyze = async (jdText: string, jobTitle: string, company: string) => {
    if (!resume) return;
    setError(null);
    setIsAnalyzing(true);
    try {
      const res = await api.analyzeResume({
        resumeId: resume.id,
        jdText,
        jobTitle,
        company,
      });
      if (res.data) setAnalysis(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Generate cover letter
  const handleGenerateCoverLetter = async () => {
    if (!analysis) return;
    setIsGenerating("cover-letter");
    try {
      const res = await api.generateCoverLetter({
        analysisResultId: analysis.id,
      });
      if (res.data?.coverLetter) setGeneratedCoverLetter(res.data.coverLetter);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setIsGenerating(null);
    }
  };

  // Generate tailored resume
  const handleGenerateResume = async () => {
    if (!analysis) return;
    setIsGenerating("resume");
    try {
      const res = await api.generateTailoredResume({
        analysisResultId: analysis.id,
      });
      if (res.data?.generatedResume) setGeneratedResume(res.data.generatedResume);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setIsGenerating(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Analyze Your Resume</h1>
        <p className="text-gray-400">
          Upload your resume, paste a job description, and let AI do the rest.
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-5 py-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Step indicator */}
      <div className="flex items-center gap-4">
        <StepIndicator step={1} label="Upload Resume" active={!resume} complete={!!resume} />
        <div className="flex-1 h-px bg-white/10" />
        <StepIndicator step={2} label="Add Job Description" active={!!resume && !analysis} complete={!!analysis} />
        <div className="flex-1 h-px bg-white/10" />
        <StepIndicator step={3} label="Results" active={!!analysis} complete={false} />
      </div>

      {/* Step 1: Upload Resume */}
      {!resume && (
        <ResumeUploader onUpload={handleUploadResume} isLoading={isUploading} />
      )}

      {/* Resume uploaded confirmation + Step 2 */}
      {resume && !analysis && (
        <div className="space-y-6">
          <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-5 py-3 text-emerald-400 text-sm flex items-center gap-3">
            <span className="text-lg">✅</span>
            Resume &ldquo;{resume.fileName}&rdquo; uploaded successfully!
          </div>
          <JDInput onSubmit={handleAnalyze} isLoading={isAnalyzing} />
        </div>
      )}

      {/* Step 3: Results */}
      {analysis && (
        <div className="space-y-8">
          {/* Score + Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="flex justify-center lg:justify-start">
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

          {/* Generation Actions */}
          <Card>
            <CardHeader>
              <CardTitle>🚀 Generate Content</CardTitle>
            </CardHeader>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={handleGenerateCoverLetter}
                isLoading={isGenerating === "cover-letter"}
                variant="secondary"
              >
                ✉️ Generate Cover Letter
              </Button>
              <Button
                onClick={handleGenerateResume}
                isLoading={isGenerating === "resume"}
                variant="secondary"
              >
                📝 Generate Tailored Resume
              </Button>
            </div>
          </Card>

          {/* Generated Cover Letter */}
          {generatedCoverLetter && (
            <Card>
              <CardHeader>
                <CardTitle>✉️ Generated Cover Letter</CardTitle>
              </CardHeader>
              <div className="bg-white/5 rounded-xl p-5 text-gray-300 text-sm leading-relaxed whitespace-pre-line font-serif">
                {generatedCoverLetter}
              </div>
            </Card>
          )}

          {/* Generated Resume */}
          {generatedResume && (
            <Card>
              <CardHeader>
                <CardTitle>📝 Tailored Resume</CardTitle>
              </CardHeader>
              <div className="bg-white/5 rounded-xl p-5 text-gray-300 text-sm leading-relaxed whitespace-pre-line font-mono">
                {generatedResume}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Step Indicator Component ────────────────────────────────

function StepIndicator({
  step,
  label,
  active,
  complete,
}: {
  step: number;
  label: string;
  active: boolean;
  complete: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
          complete
            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
            : active
            ? "bg-violet-500/20 text-violet-400 border border-violet-500/30"
            : "bg-white/5 text-gray-600 border border-white/10"
        }`}
      >
        {complete ? "✓" : step}
      </div>
      <span
        className={`text-sm hidden sm:block ${
          active ? "text-white" : complete ? "text-emerald-400" : "text-gray-600"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
