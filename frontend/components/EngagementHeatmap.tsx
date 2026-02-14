"use client";

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface EngagementData {
    time: string;
    type: 'active' | 'static';
    score: number;
}

interface HeatmapProps {
    data: EngagementData[];
}

export default function EngagementHeatmap({ data }: HeatmapProps) {
    // Transform data for visualization
    // We'll map 'active' to positive values and 'static' to lower values for visual distinction
    const chartData = data.map(d => ({
        ...d,
        value: d.type === 'active' ? 10 : 2,
        fill: d.type === 'active' ? '#22c55e' : '#ef4444' // Green for active, Red for static
    }));

    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">Engagement Timeline</h3>

            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="time"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#64748b' }}
                        />
                        <Tooltip
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const data = payload[0].payload;
                                    return (
                                        <div className="bg-slate-900 text-white text-xs rounded-md p-2 shadow-xl">
                                            <p className="font-semibold mb-1">{data.time}</p>
                                            <p className={data.type === 'active' ? 'text-green-400' : 'text-red-400'}>
                                                {data.type === 'active' ? 'Active Teaching' : 'Static Slide'}
                                            </p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Area
                            type="stepAfter"
                            dataKey="value"
                            stroke="none"
                            fill="url(#colorEngagement)"
                        />
                        {/* Custom rendering for color blocks */}
                        {chartData.map((entry, index) => (
                            <rect
                                key={`rect-${index}`}
                                x={`${(index / chartData.length) * 100}%`}
                                y={0}
                                width={`${100 / chartData.length}%`}
                                height="100%"
                                fill={entry.fill}
                                className="opacity-20 hover:opacity-30 transition-opacity"
                            />
                        ))}
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="flex gap-6 mt-4 justify-center">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500 opacity-20"></div>
                    <span className="text-sm text-slate-600">Active Teaching (Whiteboard)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500 opacity-20"></div>
                    <span className="text-sm text-slate-600">Static Slide (PDF)</span>
                </div>
            </div>
        </div>
    );
}
