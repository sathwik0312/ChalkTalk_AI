import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Youtube, FileText, BrainCircuit, AlertCircle, BarChart3, GraduationCap, CheckCircle2 } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import RedirectIfAuthenticated from '../components/RedirectIfAuthenticated';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 overflow-x-hidden font-[family-name:var(--font-geist-sans)]">
      <RedirectIfAuthenticated />

      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-slate-900 dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-slate-900">
              <Sparkles size={18} />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">ChalkTalk AI</span>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 text-sm font-medium bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
            >
              Sign up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
            Protecting the Human Art of Teaching, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400">
              from the AI Takeover.
            </span>
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-10">
            ChalkTalk AI is the world’s first multi-modal lecture auditor. We use agentic vision to help professors move from passive slide-sharing to active, high-impact teaching.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link
              href="/signup"
              className="px-8 py-4 text-lg font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shadow-lg shadow-slate-900/20 dark:shadow-white/10"
            >
              Get Started for Free
              <ArrowRight size={20} />
            </Link>
          </div>

          {/* 3D Dashboard Container */}
          <div className="relative max-w-5xl mx-auto mb-24">
            <img
              src="/assets/ai-diagram-v2.jpg"
              alt="AI Analysis Diagram"
              className="w-full h-auto rounded-xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium mb-6">
                <AlertCircle size={14} />
                The Problem
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                The "Death by PowerPoint" Crisis.
              </h2>
              <blockquote className="text-xl font-medium text-slate-700 dark:text-slate-300 border-l-4 border-red-500 pl-6 mb-8 italic">
                "Did you know student retention drops by 40% when a lecture is purely slide-based?"
              </blockquote>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
                Today’s university experience is drowning in static PDFs. When professors stop writing, students stop engaging.
              </p>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                ChalkTalk AI was built by engineers who were tired of boring lectures—designed to bring the <span className="font-bold text-slate-900 dark:text-white">"spark"</span> back to the whiteboard.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-950 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 relative">
              {/* Abstract Visual for "Boring Slides" vs "Spark" */}
              <div className="grid grid-cols-2 gap-4 h-64">
                <div className="bg-slate-100 dark:bg-slate-900 rounded-lg flex flex-col items-center justify-center p-4 opacity-50 border-2 border-dashed border-slate-300 dark:border-slate-700">
                  <FileText className="h-10 w-10 mb-2 text-slate-400" />
                  <span className="text-sm font-mono text-slate-400">Static.pdf</span>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg flex flex-col items-center justify-center p-4 border-2 border-blue-500 dark:border-blue-400 relative overflow-hidden">
                  <div className="absolute inset-0 bg-blue-500/5 animate-pulse"></div>
                  <BrainCircuit className="h-10 w-10 mb-2 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-bold text-blue-700 dark:text-blue-300">Active Learning</span>
                </div>
                <div className="col-span-2 bg-slate-50 dark:bg-slate-900 rounded-lg p-4 flex items-center justify-between border border-slate-200 dark:border-slate-800">
                  <div className="flex gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-400"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                    <div className="h-3 w-3 rounded-full bg-green-400"></div>
                  </div>
                  <span className="text-xs font-mono text-slate-500">analyzing engagement...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">Real-Time Multi-Modal Intelligence.</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Powered by advanced AI models to analyze every second of your teaching.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-colors group">
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                <Sparkles size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Vision-Driven Auditing</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Using Google ADK and Gemini 2.5 Flash, our agents "watch" the video stream to distinguish between static slides and active handwriting.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-violet-500 dark:hover:border-violet-500 transition-colors group">
              <div className="h-12 w-12 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center text-violet-600 dark:text-violet-400 mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">The "Chalk-to-Slide" Ratio</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Get a definitive score on your teaching style. We quantify exactly how much of your lecture was "active" versus "passive."
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-teal-500 dark:hover:border-teal-500 transition-colors group">
              <div className="h-12 w-12 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center text-teal-600 dark:text-teal-400 mb-6 group-hover:scale-110 transition-transform">
                <GraduationCap size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Pedagogical Heatmaps</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                See exactly where you lost the room. Our AI maps audio clarity against visual movement to find your lecture's "dead zones."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Value Prop Section */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-900/20 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm font-medium mb-6">
                <CheckCircle2 size={14} />
                Value Proposition
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Your Personal Teaching Coach.
              </h2>
              <p className="text-xl text-slate-300 mb-8">

              </p>

              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="h-6 w-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle2 size={14} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Instant Feedback</h4>
                    <p className="text-slate-400">Receive a post-lecture report with 3 actionable tips to increase engagement.</p>
                  </div>
                </li>
                {/* <li className="flex gap-4">
                  <div className="h-6 w-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center flex-shrink-0 mt-1">
                    
                  </div>

                </li> */}
              </ul>
            </div>
            {/* Visual Placeholder for "Coach" */}
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
              <div className="relative bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-bold text-lg">Lecture Insight #42</h3>
                  <span className="text-xs font-mono text-green-400">AI ANALYZED</span>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-700/50 rounded-lg border-l-4 border-yellow-500">
                    <p className="text-sm text-slate-300">"Consider pausing at 14:20. You switched slides rapidly while explaining a complex formula."</p>
                  </div>
                  <div className="p-4 bg-slate-700/50 rounded-lg border-l-4 border-green-500">
                    <p className="text-sm text-slate-300">"Excellent engagement spike at 22:15 when you moved to the whiteboard."</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer / CTA */}
      <footer className="bg-slate-50 dark:bg-slate-950 py-20 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-8">
            Ready to make your next lecture unforgettable?
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/signup"
              className="px-8 py-4 text-lg font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shadow-lg"
            >
              Get Started Now
              <ArrowRight size={20} />
            </Link>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-6 w-6 bg-slate-900 dark:bg-white rounded-md flex items-center justify-center text-white dark:text-slate-900">
                <Sparkles size={14} />
              </div>
              <span className="font-bold text-slate-900 dark:text-white">ChalkTalk AI</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Built for the future of education. Powered by Google ADK.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
