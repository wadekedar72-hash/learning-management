import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../common/Button';

export function VideoMeta({ video, onNext, onPrevious }) {
  return (
    <div className="mt-6 space-y-4">
      {/* Title and Description */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{video.title}</h1>
        <p className="text-gray-600 mt-2">{video.description}</p>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        {video.previous_video_id ? (
          <Link to={`/subjects/${video.subject_id}/video/${video.previous_video_id}`}>
            <Button variant="secondary" className="flex items-center gap-2">
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
          </Link>
        ) : (
          <div />
        )}

        {video.next_video_id ? (
          <Link to={`/subjects/${video.subject_id}/video/${video.next_video_id}`}>
            <Button className="flex items-center gap-2">
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
