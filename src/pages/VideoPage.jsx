import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppShell } from '../components/Layout/AppShell';
import { SubjectSidebar } from '../components/Sidebar/SubjectSidebar';
import { VideoPlayer } from '../components/Video/VideoPlayer';
import { VideoMeta } from '../components/Video/VideoMeta';
import { Spinner, Alert } from '../components/common/Button';
import { AuthGuard } from '../components/Auth/AuthGuard';
import { Lock, CheckCircle2 } from 'lucide-react';
import apiClient from '../lib/apiClient';
import { getVideoProgress } from '../lib/progress';
import { useVideoStore } from '../store/videoStore';
import { useSidebarStore } from '../store/sidebarStore';

export function VideoPage() {
  return (
    <AuthGuard>
      <VideoPageContent />
    </AuthGuard>
  );
}

function VideoPageContent() {
  const { videoId, subjectId } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { setVideo: setVideoStore, reset: resetVideoStore, nextVideoId } = useVideoStore();
  const { markVideoCompleted } = useSidebarStore();

  useEffect(() => {
    resetVideoStore();
    fetchVideoData();
  }, [videoId, subjectId]);

  const fetchVideoData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch video metadata
      const videoResponse = await apiClient.get(`/videos/${videoId}`);
      const videoData = videoResponse.data.data;
      setVideo(videoData);
      setVideoStore(videoData);

      // If video is locked, don't fetch progress
      if (videoData.locked) {
        setLoading(false);
        return;
      }

      // Fetch progress for resume
      const progressResponse = await getVideoProgress(videoId);
      setProgress(progressResponse.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load video');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleted = useCallback(() => {
    markVideoCompleted(videoId);
    
    // Auto-navigate to next video after a short delay
    if (nextVideoId) {
      setTimeout(() => {
        navigate(`/subjects/${subjectId}/video/${nextVideoId}`);
      }, 2000);
    }
  }, [videoId, subjectId, nextVideoId, markVideoCompleted, navigate]);

  if (loading) {
    return (
      <AppShell sidebar={<SubjectSidebar currentVideoId={videoId} />}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Spinner size="lg" />
        </div>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell sidebar={<SubjectSidebar currentVideoId={videoId} />}>
        <Alert type="error" message={error} />
      </AppShell>
    );
  }

  if (!video) {
    return (
      <AppShell sidebar={<SubjectSidebar currentVideoId={videoId} />}>
        <Alert type="error" message="Video not found" />
      </AppShell>
    );
  }

  return (
    <AppShell sidebar={<SubjectSidebar currentVideoId={videoId} />}>
      <div className="max-w-4xl">
        {/* Locked Video State */}
        {video.locked ? (
          <div className="card p-12 text-center">
            <Lock className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Video Locked
            </h2>
            <p className="text-gray-600">
              {video.unlock_reason || 'Complete the previous video to unlock this one.'}
            </p>
          </div>
        ) : (
          <>
            {/* Video Player */}
            <VideoPlayer
              videoId={videoId}
              youtubeVideoId={video.youtube_video_id}
              startPositionSeconds={progress?.last_position_seconds || 0}
              onCompleted={handleCompleted}
            />

            {/* Video Info */}
            <VideoMeta video={video} />

            {/* Completion Message */}
            {progress?.is_completed && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-green-800">
                  You've completed this video!
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}
