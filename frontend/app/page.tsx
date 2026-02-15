"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import VideoUpload from '../components/VideoUpload';
import EngagementHeatmap from '../components/EngagementHeatmap';
import FeedbackSummary from '../components/FeedbackSummary';
import { LayoutDashboard, History, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';
import UserMenu from '../components/UserMenu';

export default function Home() {
  const [analysisData, setAnalysisData] = useState<any>(null);
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin h-8 w-8 border-4 border-slate-900 dark:border-slate-100 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const handleUploadComplete = (data: any) => {
    if (data.analysis && data.analysis.score) {
      setAnalysisData(data.analysis);
      return;
    }

    const mockData = {
      score: 7.5,
      summary: [
        "Great use of active writing at the beginning of the lecture.",
        "Mid-lecture segment (15:00-25:00) relied too heavily on static slides.",
        "Consider breaking up long PDF scrolls with more verbal checks for understanding."
      ],
      suggestions: [
        "The conceptual explanation of 'recursion' at 12:30 could use a visual diagram instead of just code.",
        "More active questioning during the 'sorting algorithms' section would improve engagement.",
        "The slide on 'Big O Notation' was dense; breaking it down into steps on the board would be better."
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
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 font-[family-name:var(--font-geist-sans)] transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-slate-900 dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-slate-900">
              <LayoutDashboard size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Pedagogy-Vision</h1>
              <p className="text-slate-500 dark:text-slate-400">Automated Lecture Quality Auditor</p>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">ChalkTalk AI</h1>
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
              suggestions={analysisData.suggestions}
            />
            <EngagementHeatmap data={analysisData.timeline} />

            <button
              onClick={() => setAnalysisData(null)}
              className="mt-8 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 text-sm font-medium underline underline-offset-4"
            >
              Analyze another video
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
