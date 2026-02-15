"use client";

import React, { useState } from 'react';
import { Upload, FileVideo, CheckCircle, AlertCircle, Link as LinkIcon, Download } from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../context/AuthContext';

interface VideoUploadProps {
    onUploadComplete: (data: any) => void;
}

export default function VideoUpload({ onUploadComplete }: VideoUploadProps) {
    const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [url, setUrl] = useState('');
    const { user } = useAuth();

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFiles(e.target.files);
        }
    };

    const handleFiles = async (files: FileList) => {
        const file = files[0];
        if (file.type !== 'video/mp4') {
            setError('Please upload an MP4 file.');
            return;
        }

        if (!user) {
            setError('You must be logged in to upload videos.');
            return;
        }

        setError(null);
        setIsUploading(true);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('user_id', user.id);

        try {
            const response = await fetch('http://localhost:8000/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();
            onUploadComplete(data);
        } catch (err) {
            setError('Failed to upload video. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleUrlSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url.trim()) return;

        if (!user) {
            setError('You must be logged in to analyze videos.');
            return;
        }

        setError(null);
        setIsUploading(true);

        try {
            const response = await fetch('http://localhost:8000/analyze-url', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url, user_id: user.id }),
            });

            if (!response.ok) {
                throw new Error('Analysis failed');
            }

            const data = await response.json();
            onUploadComplete(data);
        } catch (err) {
            setError('Failed to analyze URL. Please ensure it is a valid video link.');
        } finally {
            setIsUploading(false);
        }
    };

    return (

        <div className="w-full max-w-2xl mx-auto">
            {/* Tabs Outside Card */}
            <div className="flex p-1 mb-6 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                <button
                    type="button"
                    onClick={() => setActiveTab('upload')}
                    className={clsx(
                        "flex-1 py-3 text-sm font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2",
                        activeTab === 'upload'
                            ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
                    )}
                >
                    <Upload size={18} />
                    Upload File
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('url')}
                    className={clsx(
                        "flex-1 py-3 text-sm font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2",
                        activeTab === 'url'
                            ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
                    )}
                >
                    <LinkIcon size={18} />
                    Video Link
                </button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                <div className="p-8 min-h-[400px] flex flex-col justify-center">
                    {activeTab === 'upload' ? (
                        <div
                            className={clsx(
                                "border-3 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer",
                                isDragging
                                    ? "border-slate-900 bg-slate-50 dark:border-white dark:bg-slate-800"
                                    : "border-slate-200 hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:hover:border-slate-500 dark:hover:bg-slate-800/50"
                            )}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => document.getElementById('video-input')?.click()}
                        >
                            <input
                                id="video-input"
                                type="file"
                                accept="video/mp4"
                                className="hidden"
                                onChange={handleFileInput}
                                disabled={isUploading}
                            />

                            {isUploading ? (
                                <div className="flex flex-col items-center gap-4">
                                    <div className="animate-spin h-10 w-10 border-4 border-slate-900 dark:border-white border-t-transparent rounded-full"></div>
                                    <p className="text-slate-600 dark:text-slate-300 font-medium">Analyzing lecture content...</p>
                                    <p className="text-xs text-slate-400">This may take a minute</p>
                                </div>
                            ) : (
                                <>
                                    <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-900 dark:text-white">
                                        <FileVideo size={32} />
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                                        Upload lecture video
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                                        Drag and drop your MP4 file here, or click to browse
                                    </p>
                                    <button type="button" className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2.5 rounded-xl font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors">
                                        Select File
                                    </button>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="py-8 px-4">
                            <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-900 dark:text-white">
                                <LinkIcon size={32} />
                            </div>
                            <form onSubmit={handleUrlSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="url-input" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Paste Video URL (YouTube, etc.)
                                    </label>
                                    <input
                                        id="url-input"
                                        type="url"
                                        placeholder="https://www.youtube.com/watch?v=..."
                                        className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-900 dark:focus:ring-white focus:border-transparent outline-none transition-all"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        disabled={isUploading}
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isUploading || !url}
                                    className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 rounded-xl font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isUploading ? (
                                        <>
                                            <div className="animate-spin h-4 w-4 border-2 border-white dark:border-slate-900 border-t-transparent rounded-full"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Download size={18} />
                                            Analyze Video
                                        </>
                                    )}
                                </button>
                            </form>
                            <p className="text-center text-xs text-slate-400 mt-4">
                                Supports YouTube and direct MP4 links
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl flex items-center gap-3 text-sm border border-red-100 dark:border-red-900/30">
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
