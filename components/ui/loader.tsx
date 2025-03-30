import React from 'react';

interface LoaderProps {
  percentage?: number;
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({ percentage = null, message = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm">
      <div className="p-12 bg-transparent rounded-lg shadow-lg border border-blue-400/40">
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-row gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-700 animate-bounce [animation-delay:.7s]"></div>
            <div className="w-8 h-8 rounded-full bg-blue-700 animate-bounce [animation-delay:.3s]"></div>
            <div className="w-8 h-8 rounded-full bg-blue-700 animate-bounce [animation-delay:.7s]"></div>
          </div>
          <p className="text-white-700 text-lg font-medium">{message}</p>
          {percentage !== null && <p className="text-gray-500 text-sm">{percentage}% completed</p>}
        </div>
      </div>
    </div>
  );
};

export default Loader;
