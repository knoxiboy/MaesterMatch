import React from 'react';
import { cn } from "../../lib/utils";
import { 
    Accordion, 
    AccordionContent, 
    AccordionHeader, 
    AccordionItem 
} from "./Accordion";
import ScoreBadge from "./ScoreBadge";
import { CheckCircle2, AlertCircle, HelpCircle, Lightbulb } from "lucide-react";

const CategoryHeader = ({ title, score }) => {
    return (
        <div className="flex justify-between items-center w-full py-2">
            <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors">{title}</h3>
            <ScoreBadge score={score} />
        </div>
    );
};

const CategoryContent = ({ tips }) => {
    return (
        <div className="space-y-8 py-4">
            {/* Quick Points Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tips.map((tip, index) => (
                    <div key={index} className="flex gap-3 items-start p-4 rounded-2xl bg-white/2 border border-white/5 hover:border-white/10 transition-all">
                        <div className={cn(
                            "mt-0.5 size-5 rounded-full flex items-center justify-center shrink-0",
                            tip.type === "good" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                        )}>
                            {tip.type === "good" ? <CheckCircle2 className="size-3" /> : <AlertCircle className="size-3" />}
                        </div>
                        <p className="text-gray-300 text-sm font-medium leading-snug">{tip.tip}</p>
                    </div>
                ))}
            </div>
            
            {/* Detailed Explanations */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 px-2">
                    <Lightbulb className="size-4 text-primary-400" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Actionable Intelligence</p>
                </div>
                
                {tips.map((tip, index) => (
                    <div
                        key={index}
                        className={cn(
                            "p-6 rounded-[24px] border transition-all duration-300",
                            tip.type === "good" 
                                ? "bg-emerald-500/5 border-emerald-500/10 hover:border-emerald-500/20 shadow-lg shadow-emerald-500/5" 
                                : "bg-amber-500/5 border-amber-500/10 hover:border-amber-500/20 shadow-lg shadow-amber-500/5"
                        )}
                    >
                        <div className="flex gap-4 items-center">
                            <div className={cn(
                                "size-10 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10 shrink-0",
                                tip.type === "good" ? "text-emerald-400" : "text-amber-400"
                            )}>
                                {tip.type === "good" ? <CheckCircle2 className="size-5" /> : <AlertCircle className="size-5" />}
                            </div>
                            <h4 className="text-lg font-bold text-white">{tip.tip}</h4>
                        </div>
                        <p className="text-gray-400 text-base leading-relaxed mt-4 pl-14 opacity-80">
                            {tip.explanation}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Details = ({ feedback }) => {
    const sections = [
        { id: "ats", title: "ATS Readiness", score: feedback.ATS.score, tips: feedback.ATS.tips },
        { id: "tone", title: "Tone & Style", score: feedback.toneAndStyle.score, tips: feedback.toneAndStyle.tips },
        { id: "content", title: "Content Quality", score: feedback.content.score, tips: feedback.content.tips },
        { id: "structure", title: "Visual Structure", score: feedback.structure.score, tips: feedback.structure.tips },
        { id: "skills", title: "Role Alignment", score: feedback.skills.score, tips: feedback.skills.tips }
    ];

    return (
        <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="space-y-4 max-w-2xl">
                <span className="eyebrow">Deep Diagnostics</span>
                <h2 className="text-4xl font-black text-white tracking-tight">Performance Breakdown</h2>
                <p className="text-gray-400 text-lg leading-relaxed">
                    We've audited your document across five critical performance vectors. Expand each section for precise rewrite guidance.
                </p>
            </div>

            <Accordion defaultOpen="ats" className="w-full">
                {sections.map((section) => (
                    <AccordionItem key={section.id} id={section.id}>
                        <AccordionHeader itemId={section.id}>
                            <CategoryHeader title={section.title} score={section.score} />
                        </AccordionHeader>
                        <AccordionContent itemId={section.id}>
                            <CategoryContent tips={section.tips} />
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
};

export default Details;
