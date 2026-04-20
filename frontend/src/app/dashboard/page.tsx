"use client";

import React, { useEffect, useState } from "react";
import { HistoryCard } from "@/components/HistoryCard";
import { Card } from "@/components/ui/Card";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import * as api from "@/services/api";
import { AnalysisResult } from "@/types";
import Link from "next/link";

// ──────────────────────────────────────────────────────────────
// Dashboard Page — Analysis history list
// ──────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await api.getHistory();
        if (res.data) setHistory(res.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load history"
        );
      } finally {
        setIsLoading(false);
      }
    }
    fetchHistory();
  }, []);

  return (
    <ProtectedRoute>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-gray-400">
              Your analysis history — click any card to see full results.
            </p>
          </div>

          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-500/25 transition-all"
          >
            + New Analysis
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-5 py-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-4 bg-white/10 rounded w-1/3 mb-3" />
                <div className="h-3 bg-white/5 rounded w-2/3" />
              </Card>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && history.length === 0 && !error && (
          <Card className="text-center py-16">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No analyses yet
            </h3>
            <p className="text-gray-400 mb-6">
              Start by uploading a resume and matching it against a job description.
            </p>
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium hover:from-violet-500 hover:to-indigo-500 transition-all"
            >
              Start Your First Analysis
            </Link>
          </Card>
        )}

        {/* History list */}
        {!isLoading && history.length > 0 && (
          <div className="grid grid-cols-1 gap-4">
            {history.map((analysis) => (
              <HistoryCard key={analysis.id} analysis={analysis} />
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
