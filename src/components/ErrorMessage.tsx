
import React from 'react';
import { XCircleIcon } from './icons/XCircleIcon';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="bg-red-900/30 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg relative flex items-center gap-3" role="alert">
      <XCircleIcon className="w-6 h-6 text-red-400 flex-shrink-0" />
      <div>
        <strong className="font-bold block">Error</strong>
        <span className="block sm:inline">{message}</span>
      </div>
    </div>
  );
};

export default ErrorMessage;
