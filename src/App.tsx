
import React, { useCallback, useState } from 'react';
import type { FactCheckResponse } from '../types';
import ErrorMessage from './components/ErrorMessage';
import { CheckCircleIcon } from './components/icons/CheckCircleIcon';
import LoadingSpinner from './components/LoadingSpinner';
import QueryInput from './components/QueryInput';
import ResultsDisplay from './components/ResultsDisplay';
import { factCheckWithGoogleSearch } from './services/geminiService';

const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [result, setResult] = useState<FactCheckResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFactCheck = useCallback(async () => {
    if (!query.trim()) {
      setError('Please enter a topic to fact-check.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await factCheckWithGoogleSearch(query);
      setResult(response);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  const WelcomeScreen = () => (
    <div className="text-center p-8">
      <div className="inline-block bg-blue-900/50 p-4 rounded-full mb-4">
        <CheckCircleIcon className="w-16 h-16 text-blue-400" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Welcome to Veritas</h2>
      <p className="text-gray-400 max-w-2xl mx-auto">
        Enter a news topic, a claim, or a question below. Our AI-powered system will use Google Search to find the latest information, provide a fact-checked summary, assess the credibility of the sources, and show you the evidence.
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <header className="w-full max-w-4xl text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Veritas
        </h1>
        <p className="text-lg text-gray-400 mt-2">AI-Powered Real-Time Fact-Checker</p>
      </header>
      
      <main className="w-full max-w-4xl flex-grow">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-2xl shadow-blue-900/20 p-6">
          <QueryInput
            query={query}
            setQuery={setQuery}
            onFactCheck={handleFactCheck}
            isLoading={isLoading}
          />

          <div className="mt-6">
            {isLoading && <LoadingSpinner />}
            {error && <ErrorMessage message={error} />}
            {!isLoading && !error && !result && <WelcomeScreen />}
            {result && <ResultsDisplay result={result} />}
          </div>
        </div>
      </main>

    </div>
  );
};

export default App;
