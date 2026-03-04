import { create } from 'zustand';
import apiClient from '../lib/apiClient';

export const useSidebarStore = create((set, get) => ({
  tree: null,
  loading: false,
  error: null,

  fetchTree: async (subjectId) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get(`/subjects/${subjectId}/tree`);
      set({ tree: response.data.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  markVideoCompleted: (videoId) => {
    const { tree } = get();
    if (!tree) return;

    const newTree = {
      ...tree,
      sections: tree.sections.map((section) => ({
        ...section,
        videos: section.videos.map((video) => {
          if (video.id === videoId) {
            return { ...video, is_completed: true, locked: false };
          }
          // Unlock next video
          const videoIndex = section.videos.findIndex((v) => v.id === videoId);
          const nextVideo = section.videos[videoIndex + 1];
          if (nextVideo && nextVideo.id === video.id) {
            return { ...video, locked: false };
          }
          return video;
        })
      }))
    };

    set({ tree: newTree });
  },

  updateVideoProgress: (videoId, isCompleted) => {
    const { tree } = get();
    if (!tree) return;

    const newTree = {
      ...tree,
      sections: tree.sections.map((section) => ({
        ...section,
        videos: section.videos.map((video) =>
          video.id === videoId ? { ...video, is_completed: isCompleted } : video
        )
      }))
    };

    set({ tree: newTree });
  }
}));
