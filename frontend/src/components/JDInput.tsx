"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";

// ──────────────────────────────────────────────────────────────
// JD Input — Job description input with optional metadata
// ──────────────────────────────────────────────────────────────

interface JDInputProps {
  onSubmit: (jdText: string, jobTitle: string, company: string) => Promise<void>;
  isLoading?: boolean;
  disabled?: boolean;
}

export function JDInput({ onSubmit, isLoading, disabled }: JDInputProps) {
  const [jdText, setJdText] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jdText.trim()) return;
    await onSubmit(jdText, jobTitle, company);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>💼 Job Description</CardTitle>
        <CardDescription>
          Paste the job description you want to match your resume against.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="job-title"
              className="block text-sm font-medium text-gray-300 mb-1.5"
            >
              Job Title
            </label>
            <input
              id="job-title"
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g., Senior Frontend Engineer"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-white placeholder-gray-500 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label
              htmlFor="company-name"
              className="block text-sm font-medium text-gray-300 mb-1.5"
            >
              Company
            </label>
            <input
              id="company-name"
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g., Google"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-white placeholder-gray-500 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="jd-text"
            className="block text-sm font-medium text-gray-300 mb-1.5"
          >
            Job Description <span className="text-red-400">*</span>
          </label>
          <textarea
            id="jd-text"
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            placeholder="Paste the full job description here..."
            rows={10}
            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-gray-500 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:outline-none transition-colors resize-y text-sm leading-relaxed"
          />
        </div>

        <Button
          type="submit"
          size="lg"
          isLoading={isLoading}
          disabled={disabled || jdText.trim().length < 50}
          className="w-full"
        >
          🔍 Analyze Match
        </Button>
      </form>
    </Card>
  );
}
