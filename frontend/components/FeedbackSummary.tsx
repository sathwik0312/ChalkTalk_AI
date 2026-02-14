"use client";

import React from 'react';
import { Target, TrendingUp, Lightbulb } from 'lucide-react';

interface FeedbackSummaryProps {
    score: number;
    summary: string[];
}

export default function FeedbackSummary({ score, summary }: FeedbackSummaryProps) {
    const getScoreColor = (s: number) => {
        if (s >= 8) return 'text-green-600 bg-green-50 border-green-200';
        if (s >= 5) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        return 'text-red-600 bg-red-50 border-red-200';
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {/* Score Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
                <h3 className="text-slate-500 font-medium mb-4 flex items-center gap-2">
                    <Target size={18} />
                    Engagement Score
                </h3>
                <div className={`h-24 w-24 rounded-full flex items-center justify-center border-4 text-3xl font-bold ${getScoreColor(score)}`}>
                    {score}/10
                </div>
            </div>

            {/* Summary Card */}
            <div className="md:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-slate-800 font-semibold mb-4 flex items-center gap-2">
                    <Lightbulb size={20} className="text-yellow-500" />
                    Executive Summary
                </h3>
                <ul className="space-y-3">
                    {summary.map((item, i) => (
                        <li key={i} className="flex gap-3 text-slate-600">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-sm font-medium">
                                {i + 1}
                            </span>
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
