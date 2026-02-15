"use client";

import React from 'react';
import { Target, TrendingUp, Lightbulb } from 'lucide-react';

interface FeedbackSummaryProps {
    score: number;
    summary: string[];
    suggestions?: string[];
}

export default function FeedbackSummary({ score, summary, suggestions }: FeedbackSummaryProps) {
    const getScoreColor = (s: number) => {
        if (s >= 8) return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
        if (s >= 5) return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {/* Score Card */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center">
                <h3 className="text-slate-500 dark:text-slate-400 font-medium mb-4 flex items-center gap-2">
                    <Target size={18} />
                    Engagement Score
                </h3>
                <div className={`h-24 w-24 rounded-full flex items-center justify-center border-4 text-3xl font-bold ${getScoreColor(score)}`}>
                    {score}/10
                </div>
            </div>

            <div className="md:col-span-2 space-y-6">
                {/* Executive Summary */}
                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
                    <h3 className="text-slate-800 dark:text-white font-semibold mb-4 flex items-center gap-2">
                        <Lightbulb size={20} className="text-yellow-500" />
                        Executive Summary
                    </h3>
                    <ul className="space-y-3">
                        {summary.map((item, i) => (
                            <li key={i} className="flex gap-3 text-slate-600 dark:text-slate-300">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center text-sm font-medium">
                                    {i + 1}
                                </span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Specific Improvements */}
                {suggestions && suggestions.length > 0 && (
                    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
                        <h3 className="text-slate-800 dark:text-white font-semibold mb-4 flex items-center gap-2">
                            <TrendingUp size={20} className="text-blue-500" />
                            Areas for Improvement
                        </h3>
                        <ul className="space-y-3">
                            {suggestions.map((item, i) => (
                                <li key={i} className="flex gap-3 text-slate-600 dark:text-slate-300">
                                    <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400 mt-2" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
