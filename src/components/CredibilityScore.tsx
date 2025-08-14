
import React from 'react';

interface CredibilityScoreProps {
  score: number;
}

const CredibilityScore: React.FC<CredibilityScoreProps> = ({ score }) => {
  const getScoreColor = (s: number) => {
    if (s >= 75) return 'text-green-400';
    if (s >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getBackgroundColor = (s: number) => {
    if (s >= 75) return 'bg-green-400/20';
    if (s >= 40) return 'bg-yellow-400/20';
    return 'bg-red-400/20';
  };
  
  const getRingColor = (s: number) => {
    if (s >= 75) return 'stroke-green-400';
    if (s >= 40) return 'stroke-yellow-400';
    return 'stroke-red-400';
  };

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className={`relative w-36 h-36 flex items-center justify-center rounded-full ${getBackgroundColor(score)}`}>
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
        <circle
          className="text-gray-700"
          strokeWidth="8"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
        />
        <circle
          className={`${getRingColor(score)} transition-all duration-1000 ease-out`}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className={`text-4xl font-bold ${getScoreColor(score)}`}>
          {score}
        </span>
        <span className="text-sm font-medium text-gray-400">/ 100</span>
      </div>
    </div>
  );
};

export default CredibilityScore;
