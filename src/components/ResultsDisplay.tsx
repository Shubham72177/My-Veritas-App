
import React from 'react';
import type { FactCheckResponse } from '../../types';
import CredibilityScore from './CredibilityScore';
import { InfoIcon } from './icons/InfoIcon';

interface ResultsDisplayProps {
  result: FactCheckResponse;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Credibility Score and Justification */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Credibility Assessment</h2>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-shrink-0">
            <CredibilityScore score={result.credibilityScore} />
          </div>
          <div className="text-gray-300">
            <p className="font-semibold text-white mb-1">Justification:</p>
            <p>{result.justification}</p>
          </div>
        </div>
      </div>

      {/* Fact-Checked Summary */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-3">Fact-Checked Summary</h2>
        <div className="prose prose-invert prose-p:text-gray-300 prose-strong:text-white max-w-none space-y-4 whitespace-pre-wrap">
          {result.summary}
        </div>
      </div>
      
      {/* Sources */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Sources Found</h2>
        {result.sources.length > 0 ? (
          <ul className="space-y-3">
            {result.sources.map((source, index) => (
              <li key={index} className="bg-gray-800 hover:bg-gray-700/50 transition-colors duration-200 border border-gray-700 rounded-lg">
                <a
                  href={source.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4"
                >
                  <p className="font-semibold text-blue-400 truncate">{source.title}</p>
                  <p className="text-sm text-gray-500 truncate">{source.uri}</p>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex items-center gap-3 bg-gray-800 border border-gray-700 rounded-lg p-4">
             <InfoIcon className="w-6 h-6 text-yellow-400 flex-shrink-0" />
            <p className="text-gray-400">
              No specific web sources were cited by the model for this response. The answer may be based on its general knowledge.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsDisplay;