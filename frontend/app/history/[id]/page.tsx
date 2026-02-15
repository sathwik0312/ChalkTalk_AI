"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Calendar, History, Award } from 'lucide-react';
import EngagementHeatmap from '../../../components/EngagementHeatmap';
import FeedbackSummary from '../../../components/FeedbackSummary';

interface HistoryRecord {
    id: string;
    title: string;
    description: string;
    date: string;
    score: number;
    thumbnail: string;
    analysis: any;
}

export default function HistoryDetailsPage() {
    const params = useParams();
    const id = params?.id as string;
    const [record, setRecord] = useState<HistoryRecord | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/history/${id}`)
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch record");
                return res.json();
            })
            .then(data => {
                if (data.error) throw new Error(data.error);
                setRecord(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching history item:", err);
                setError(err.message);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <main className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 font-[family-name:var(--font-geist-sans)] flex justify-center items-center transition-colors duration-300">
                <div className="animate-spin h-8 w-8 border-4 border-slate-900 dark:border-slate-100 border-t-transparent rounded-full"></div>
            </main>
        );
    }

    if (error || !record) {
        return (
            <main className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 font-[family-name:var(--font-geist-sans)] flex flex-col justify-center items-center transition-colors duration-300">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Error Loading Analysis</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6">{error || "Record not found"}</p>
                <Link
                    href="/history"
                    className="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-white hover:underline"
                >
                    <ArrowLeft size={16} />
                    Back to History
                </Link>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 font-[family-name:var(--font-geist-sans)] transition-colors duration-300">
            <div className="max-w-6xl mx-auto">
                <header className="mb-8">
                    <Link
                        href="/history"
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-4 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back to History
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{record.title}</h1>
                            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                                <div className="flex items-center gap-1">
                                    <Calendar size={14} />
                                    <span>{new Date(record.date).toLocaleDateString()} at {new Date(record.date).toLocaleTimeString()}</span>
                                </div>
                                <div className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                                    <Award size={14} className={record.score >= 7 ? "text-green-600 dark:text-green-400" : record.score >= 5 ? "text-amber-500 dark:text-amber-400" : "text-red-500 dark:text-red-400"} />
                                    <span>Score: {record.score}/10</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <FeedbackSummary
                        score={record.analysis.score}
                        summary={record.analysis.summary}
                        suggestions={record.analysis.suggestions}
                    />

                    <EngagementHeatmap data={record.analysis.timeline} />

                    {/* Thumbnail Preview */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Representative Frame</h3>
                        <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 max-w-2xl">
                            <img
                                src={record.thumbnail.startsWith('data:') ? record.thumbnail : `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}${record.thumbnail}`}
                                alt="Representative frame"
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
