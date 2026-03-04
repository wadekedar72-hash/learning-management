import { create } from 'zustand';

export const useVideoStore = create((set, get) => ({
  currentVideoId: null,
  subjectId: null,
  currentTime: 0,
  duration: 0,
  isPlaying: false,
  isCompleted: false,
  nextVideoId: null,
  prevVideoId: null,
  videoData: null,

  setVideo: (videoData) => {
    set({
      currentVideoId: videoData.id,
      subjectId: videoData.subject_id,
      nextVideoId: videoData.next_video_id,
      prevVideoId: videoData.previous_video_id,
      isCompleted: false,
      currentTime: 0,
      videoData
    });
  },

  updateProgress: (time) => {
    set({ currentTime: time });
  },

  setDuration: (duration) => {
    set({ duration });
  },

  setPlaying: (isPlaying) => {
    set({ isPlaying });
  },

  markCompleted: () => {
    set({ isCompleted: true, isPlaying: false });
  },

  reset: () => {
    set({
      currentVideoId: null,
      subjectId: null,
      currentTime: 0,
      duration: 0,
      isPlaying: false,
      isCompleted: false,
      nextVideoId: null,
      prevVideoId: null,
      videoData: null
    });
  }
}));
