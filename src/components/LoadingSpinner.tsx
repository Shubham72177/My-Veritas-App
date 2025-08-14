
import React from 'react';

const LoadingSpinner: React.FC = () => {
  const messages = [
    "Contacting news archives...",
    "Scanning real-time data streams...",
    "Cross-referencing sources...",
    "Detecting potential bias...",
    "Synthesizing findings...",
    "Finalizing credibility score...",
  ];
  const [message, setMessage] = React.useState(messages[0]);

  React.useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % messages.length;
      setMessage(messages[index]);
    }, 2500);
    return () => clearInterval(interval);
  }, [messages]);

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-800/50 rounded-lg">
      <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-lg font-semibold text-white">Analyzing Information</p>
      <p className="text-gray-400 transition-opacity duration-500">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
