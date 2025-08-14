
import React from 'react';

interface QueryInputProps {
  query: string;
  setQuery: (query: string) => void;
  onFactCheck: () => void;
  isLoading: boolean;
}

const QueryInput: React.FC<QueryInputProps> = ({ query, setQuery, onFactCheck, isLoading }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading) {
      onFactCheck();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="query-input" className="block text-sm font-medium text-gray-300 mb-2">
        Enter a topic, claim, or question
      </label>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          id="query-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., 'latest discoveries on Mars'"
          className="flex-grow bg-gray-900/50 border border-gray-600 text-white rounded-md px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200 placeholder-gray-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900 transition-transform transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? 'Analyzing...' : 'Fact-Check'}
        </button>
      </div>
    </form>
  );
};

export default QueryInput;
