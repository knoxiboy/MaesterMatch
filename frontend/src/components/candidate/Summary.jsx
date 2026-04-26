import React from 'react';
import ScoreGauge from "./ScoreGauge";
import ScoreBadge from "./ScoreBadge";
import { cn } from "../../lib/utils";
import { TrendingUp, Award, Zap, Target } from "lucide-react";

const CategoryCard = ({ title, score, icon: Icon }) => {
    return (
        <div className="glass-card p-5 glass-card-hover group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-primary-500 to-indigo-500 opacity-20 group-hover:opacity-100 transition-opacity" />
            <div className="flex justify-between items-center relative z-10">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 mb-1">
                        <Icon className="size-4 text-primary-400" />
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{title}</p>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-white">{score}</span>
                        <span className="text-gray-500 font-bold text-xs">/100</span>
                    </div>
                </div>
                <ScoreBadge score={score} />
            </div>
        </div>
    );
};

const Summary = ({ feedback }) => {
    const getBenchmark = (score) => {
        if (score >= 90) return { top: "Top 5%", sentiment: "Authoritative", color: "text-emerald-400" };
        if (score >= 80) return { top: "Top 15%", sentiment: "Professional", color: "text-blue-400" };
        if (score >= 70) return { top: "Top 30%", sentiment: "Standard", color: "text-amber-400" };
        return { top: "Top 50%+", sentiment: "Needs Polish", color: "text-rose-400" };
    };

    const metrics = getBenchmark(feedback.overallScore);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="glass-card p-8 bg-gradient-to-br from-white/5 to-white/2 overflow-hidden relative">
                <div className="absolute -right-20 -top-20 size-64 bg-primary-600/10 blur-[100px] rounded-full" />
                <div className="absolute -left-20 -bottom-20 size-64 bg-pink-600/10 blur-[100px] rounded-full" />
                
                <div className="flex flex-col lg:flex-row items-center gap-10 relative z-10">
                    <div className="p-2 bg-white/5 rounded-[40px] shadow-2xl border border-white/10">
                        <ScoreGauge score={feedback.overallScore} />
                    </div>

                    <div className="flex flex-col gap-6 text-center lg:text-left items-center lg:items-start flex-1">
                        <div className="eyebrow">
                            AI Benchmarked Analysis
                        </div>
                        <div>
                            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">Composite Score</h2>
                            <p className="mt-4 text-gray-400 text-lg leading-relaxed max-w-xl">
                                Your resume was evaluated against industry-standard benchmarks using semantic role-fit and syntactic structure metrics.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl text-sm font-bold text-gray-300">
                                <span className="text-gray-500 font-medium mr-2">Percentile:</span> 
                                <span className={metrics.color}>{metrics.top}</span>
                            </div>
                            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl text-sm font-bold text-gray-300">
                                <span className="text-gray-500 font-medium mr-2">Tone:</span> 
                                <span className={metrics.color}>{metrics.sentiment}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <CategoryCard title="ATS Readiness" score={feedback.ATS.score} icon={Zap} />
                <CategoryCard title="Content Depth" score={feedback.content.score} icon={TrendingUp} />
                <CategoryCard title="Structure" score={feedback.structure.score} icon={Target} />
                <CategoryCard title="Role Alignment" score={feedback.skills.score} icon={Award} />
            </div>
        </div>
    );
};

export default Summary;
