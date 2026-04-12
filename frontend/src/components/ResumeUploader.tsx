"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";

// ──────────────────────────────────────────────────────────────
// Resume Uploader — Text area for pasting resume content
// ──────────────────────────────────────────────────────────────

interface ResumeUploaderProps {
  onUpload: (resumeText: string, fileName: string) => Promise<void>;
  isLoading?: boolean;
}

export function ResumeUploader({ onUpload, isLoading }: ResumeUploaderProps) {
  const [resumeText, setResumeText] = useState("");
  const [fileName, setFileName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText.trim()) return;
    await onUpload(resumeText, fileName || "My Resume");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>📄 Upload Your Resume</CardTitle>
        <CardDescription>
          Paste your resume text below. We&apos;ll analyze it against job descriptions
          using AI.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="resume-name"
            className="block text-sm font-medium text-gray-300 mb-1.5"
          >
            Resume Name
          </label>
          <input
            id="resume-name"
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="e.g., Software Engineer Resume"
            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-white placeholder-gray-500 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label
            htmlFor="resume-text"
            className="block text-sm font-medium text-gray-300 mb-1.5"
          >
            Resume Content <span className="text-red-400">*</span>
          </label>
          <textarea
            id="resume-text"
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your full resume text here..."
            rows={12}
            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-gray-500 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:outline-none transition-colors resize-y font-mono text-sm leading-relaxed"
          />
          <p className="mt-1 text-xs text-gray-500">
            {resumeText.length} characters
            {resumeText.length > 0 && resumeText.length < 50 && (
              <span className="text-amber-400 ml-2">
                (minimum 50 characters required)
              </span>
            )}
          </p>
        </div>

        <Button
          type="submit"
          size="lg"
          isLoading={isLoading}
          disabled={resumeText.trim().length < 50}
          className="w-full"
        >
          Upload Resume
        </Button>
      </form>
    </Card>
  );
}
