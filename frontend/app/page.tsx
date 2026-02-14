"use client";

import React, { useState } from 'react';
import VideoUpload from '../components/VideoUpload';
import EngagementHeatmap from '../components/EngagementHeatmap';
import FeedbackSummary from '../components/FeedbackSummary';
import { LayoutDashboard } from 'lucide-react';

export default function Home() {
  const [analysisData, setAnalysisData] = useState<any>(null);

  const handleUploadComplete = (data: any) => {
    // In a real app, 'data' would come from the backend.
    // For this MVP, we might mock it if the backend isn't ready,
    // but the component expects data in a specific format.

    // MOCK DATA FOR DEMONSTRATION IF BACKEND DOESN'T RETURN FULL STRUCTURE
    const mockData = {
      score: 7.5,
      summary: [
        "Great use of active writing at the beginning of the lecture.",
        "Mid-lecture segment (15:00-25:00) relied too heavily on static slides.",
        "Consider breaking up long PDF scrolls with more verbal checks for understanding."
      ],
      timeline: [
        { time: '00:00', type: 'active' },
        { time: '00:45', type: 'active' },
        { time: '01:30', type: 'static' },
        { time: '02:15', type: 'static' },
        { time: '03:00', type: 'active' },
        { time: '03:45', type: 'active' },
        { time: '04:30', type: 'static' },
      ]
    };

    setAnalysisData(data.analysis || mockData);
  };

  return (
    <main className="min-h-screen bg-slate-50 p-8 font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 flex items-center gap-3">
          <div className="h-10 w-10 bg-slate-900 rounded-lg flex items-center justify-center text-white">
            <LayoutDashboard size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Pedagogy-Vision</h1>
            <p className="text-slate-500">Automated Lecture Quality Auditor</p>
          </div>
        </header>

        {!analysisData ? (
          <div className="py-20">
            <VideoUpload onUploadComplete={handleUploadComplete} />
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <FeedbackSummary
              score={analysisData.score}
              summary={analysisData.summary}
            />
            <EngagementHeatmap data={analysisData.timeline} />

            <button
              onClick={() => setAnalysisData(null)}
              className="mt-8 text-slate-500 hover:text-slate-800 text-sm font-medium underline underline-offset-4"
            >
              Analyze another video
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
