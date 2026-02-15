"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../../components/ThemeToggle';
import { ArrowLeft, Calendar, History, PlayCircle, Award, Trash2 } from 'lucide-react';

interface HistoryRecord {
    id: string;
    title: string;
    description: string;
    date: string;
    score: number;
    thumbnail: string;
    analysis: any;
}

export default function HistoryPage() {
    const [history, setHistory] = useState<HistoryRecord[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
            return;
        }

        if (user) {
            fetch(`http://127.0.0.1:8000/history?user_id=${user.id}`)
                .then(res => res.json())
                .then(data => {
                    setHistory(data);
                    setLoadingData(false);
                })
                .catch(err => {
                    console.error("Failed to fetch history", err);
                    setLoadingData(false);
                });
        }
    }, [user, authLoading, router]);

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.preventDefault(); // Prevent navigation
        e.stopPropagation();

        if (!confirm("Are you sure you want to delete this history item?")) return;

        try {
            const res = await fetch(`http://127.0.0.1:8000/history/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                setHistory(prev => prev.filter(item => item.id !== id));
            } else {
                alert("Failed to delete item");
            }
        } catch (err) {
            console.error("Error deleting item:", err);
            alert("Error deleting item");
        }
    };

    if (authLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="animate-spin h-8 w-8 border-4 border-slate-900 dark:border-slate-100 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 font-[family-name:var(--font-geist-sans)] transition-colors duration-300">
            <div className="max-w-6xl mx-auto">
                <header className="mb-10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-slate-900 dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-slate-900">
                            <History size={20} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Lecture History</h1>
                            <p className="text-slate-500 dark:text-slate-400">Past analysis reports</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <ArrowLeft size={16} />
                            Back to Dashboard
                        </Link>
                    </div>
                </header>

                {loadingData ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin h-8 w-8 border-4 border-slate-900 border-t-transparent rounded-full"></div>
                    </div>
                ) : history.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <History size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                        <h3 className="text-lg font-medium text-slate-900 dark:text-white">No history yet</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-6">Upload a video to see your analysis history here.</p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-xl font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
                        >
                            <PlayCircle size={18} />
                            Analyze Video
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {history.map((record) => (
                            <Link key={record.id} href={`/history/${record.id}`} className="block group">
                                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 transform group-hover:-translate-y-1 h-full flex flex-col relative">
                                    <div className="aspect-video bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                                        {record.thumbnail ? (
                                            <img
                                                src={record.thumbnail.startsWith('data:') ? record.thumbnail : `http://127.0.0.1:8000${record.thumbnail}`}
                                                alt={record.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-600">
                                                <PlayCircle size={40} />
                                            </div>
                                        )}
                                        <div className="absolute top-2 right-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1 shadow-sm border border-slate-100 dark:border-slate-700">
                                            <Award size={12} className={record.score >= 7 ? "text-green-600 dark:text-green-400" : record.score >= 5 ? "text-amber-500 dark:text-amber-400" : "text-red-500 dark:text-red-400"} />
                                            <span className="text-slate-900 dark:text-white">{record.score}/10</span>
                                        </div>
                                    </div>

                                    <div className="p-5 flex-1 flex flex-col">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                                <Calendar size={12} />
                                                <span>{new Date(record.date).toLocaleDateString()}</span>
                                            </div>
                                            <button
                                                onClick={(e) => handleDelete(e, record.id)}
                                                className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                                                title="Delete Analysis"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>

                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" title={record.title}>
                                            {record.title}
                                        </h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 h-10">
                                            {record.description}
                                        </p>
                                        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4 mt-auto">
                                            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300">View Full Analysis &rarr;</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
