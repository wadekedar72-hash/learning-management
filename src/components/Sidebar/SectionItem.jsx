import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight, CheckCircle2, Lock, PlayCircle } from 'lucide-react';

export function SectionItem({ section, currentVideoId, subjectId }) {
  const [isExpanded, setIsExpanded] = useState(true);

  const completedCount = section.videos.filter((v) => v.is_completed).length;
  const totalCount = section.videos.length;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Section Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
          <span className="font-medium text-gray-900">{section.title}</span>
        </div>
        <span className="text-sm text-gray-500">
          {completedCount}/{totalCount}
        </span>
      </button>

      {/* Videos List */}
      {isExpanded && (
        <div className="divide-y divide-gray-100">
          {section.videos.map((video) => (
            <VideoItem
              key={video.id}
              video={video}
              isActive={video.id === currentVideoId}
              subjectId={subjectId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function VideoItem({ video, isActive, subjectId }) {
  const isLocked = video.locked;
  const isCompleted = video.is_completed;

  const content = (
    <div
      className={`
        flex items-center gap-3 p-3 transition-colors
        ${isActive ? 'bg-primary-50 border-l-4 border-primary-600' : 'hover:bg-gray-50 border-l-4 border-transparent'}
        ${isLocked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {/* Status Icon */}
      <div className="flex-shrink-0">
        {isLocked ? (
          <Lock className="w-5 h-5 text-gray-400" />
        ) : isCompleted ? (
          <CheckCircle2 className="w-5 h-5 text-green-500" />
        ) : (
          <PlayCircle className="w-5 h-5 text-primary-600" />
        )}
      </div>

      {/* Video Info */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${isActive ? 'text-primary-900' : 'text-gray-700'}`}>
          {video.title}
        </p>
        {video.duration_seconds && (
          <p className="text-xs text-gray-500">
            {formatDuration(video.duration_seconds)}
          </p>
        )}
      </div>
    </div>
  );

  if (isLocked) {
    return <div>{content}</div>;
  }

  return (
    <Link to={`/subjects/${subjectId}/video/${video.id}`}>
      {content}
    </Link>
  );
}

function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
