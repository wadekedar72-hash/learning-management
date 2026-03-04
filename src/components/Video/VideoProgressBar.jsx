import React from 'react';

export function VideoProgressBar({ current, duration, className = '' }) {
  if (!duration) return null;

  const progress = Math.min((current / duration) * 100, 100);

  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
      <div
        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
