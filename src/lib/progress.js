import apiClient from './apiClient';

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Debounced progress update (5 seconds)
export const debouncedUpdateProgress = debounce(async (videoId, progressData) => {
  try {
    await apiClient.post(`/progress/videos/${videoId}`, progressData);
  } catch (error) {
    console.error('Failed to update progress:', error);
  }
}, 5000);

export async function getVideoProgress(videoId) {
  const response = await apiClient.get(`/progress/videos/${videoId}`);
  return response.data;
}

export async function getSubjectProgress(subjectId) {
  const response = await apiClient.get(`/progress/subjects/${subjectId}`);
  return response.data;
}

export async function updateVideoProgress(videoId, progressData) {
  const response = await apiClient.post(`/progress/videos/${videoId}`, progressData);
  return response.data;
}
