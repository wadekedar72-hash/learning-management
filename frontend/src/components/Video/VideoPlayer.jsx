import React, { useRef, useEffect, useCallback } from 'react';
import YouTube from 'react-youtube';
import { useVideoStore } from '../../store/videoStore';
import { debouncedUpdateProgress, updateVideoProgress } from '../../lib/progress';

export function VideoPlayer({ videoId, youtubeVideoId, startPositionSeconds = 0, onCompleted }) {
  const playerRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const { setPlaying, setDuration, updateProgress, markCompleted } = useVideoStore();

  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 0,
      start: startPositionSeconds,
      modestbranding: 1,
      rel: 0
    }
  };

  const handleReady = (event) => {
    playerRef.current = event.target;
    const duration = event.target.getDuration();
    setDuration(duration);
  };

  const handleStateChange = (event) => {
    const player = event.target;
    const state = event.data;

    // YouTube Player States:
    // -1: unstarted, 0: ended, 1: playing, 2: paused, 3: buffering, 5: video cued

    if (state === 1) {
      // Playing
      setPlaying(true);
      
      // Start progress tracking interval (every 5 seconds)
      progressIntervalRef.current = setInterval(() => {
        const currentTime = player.getCurrentTime();
        updateProgress(currentTime);
        debouncedUpdateProgress(videoId, {
          last_position_seconds: Math.floor(currentTime)
        });
      }, 5000);
    } else if (state === 2 || state === 0) {
      // Paused or Ended
      setPlaying(false);
      
      // Clear interval
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }

      // Send final progress update
      const currentTime = player.getCurrentTime();
      updateProgress(currentTime);
      debouncedUpdateProgress(videoId, {
        last_position_seconds: Math.floor(currentTime)
      });

      // Handle video completion
      if (state === 0) {
        handleCompleted();
      }
    }
  };

  const handleCompleted = useCallback(async () => {
    markCompleted();
    
    // Mark as completed in backend
    try {
      await updateVideoProgress(videoId, {
        last_position_seconds: playerRef.current?.getDuration() || 0,
        is_completed: true
      });
      
      if (onCompleted) {
        onCompleted();
      }
    } catch (error) {
      console.error('Failed to mark video as completed:', error);
    }
  }, [videoId, markCompleted, onCompleted]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      
      // Send final progress on unmount
      if (playerRef.current) {
        const currentTime = playerRef.current.getCurrentTime();
        updateVideoProgress(videoId, {
          last_position_seconds: Math.floor(currentTime)
        });
      }
    };
  }, [videoId]);

  return (
    <div className="aspect-video bg-black rounded-lg overflow-hidden">
      <YouTube
        videoId={youtubeVideoId}
        opts={opts}
        onReady={handleReady}
        onStateChange={handleStateChange}
        className="w-full h-full"
        iframeClassName="w-full h-full"
      />
    </div>
  );
}
