import React from 'react';
import { cn } from '../../lib/utils';

const ScoreCircle = ({ score = 75, className = "" }) => {
    const radius = 40;
    const stroke = 6;
    const normalizedRadius = radius - stroke / 2;
    const circumference = 2 * Math.PI * normalizedRadius;
    const progress = score / 100;
    const strokeDashoffset = circumference * (1 - progress);

    return (
        <div className={cn("relative w-20 h-20", className)}>
            <svg
                height="100%"
                width="100%"
                viewBox="0 0 100 100"
                className="transform -rotate-90"
            >
                {/* Background circle */}
                <circle
                    cx="50"
                    cy="50"
                    r={normalizedRadius}
                    stroke="rgba(255, 255, 255, 0.05)"
                    strokeWidth={stroke}
                    fill="transparent"
                />
                {/* Partial circle with gradient */}
                <defs>
                    <linearGradient id="circleGrad" x1="1" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                </defs>
                <circle
                    cx="50"
                    cy="50"
                    r={normalizedRadius}
                    stroke="url(#circleGrad)"
                    strokeWidth={stroke}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                />
            </svg>

            {/* Score */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-bold text-sm text-white">{`${score}`}</span>
            </div>
        </div>
    );
};

export default ScoreCircle;
