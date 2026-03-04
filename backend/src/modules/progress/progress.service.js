const progressRepository = require('./progress.repository');
const videoRepository = require('../videos/video.repository');

class ProgressService {
  async getVideoProgress(userId, videoId) {
    const progress = await progressRepository.findByUserAndVideo(userId, videoId);
    
    return {
      last_position_seconds: progress?.last_position_seconds || 0,
      is_completed: progress?.is_completed || false
    };
  }

  async getSubjectProgress(userId, subjectId) {
    return progressRepository.getSubjectStats(userId, subjectId);
  }

  async updateProgress(userId, videoId, data) {
    // Get video to check duration
    const video = await videoRepository.findById(videoId);
    if (!video) {
      throw Object.assign(new Error('Video not found'), { status: 404 });
    }

    // Cap position at duration if available
    let position = data.last_position_seconds || 0;
    if (video.duration_seconds && position > video.duration_seconds) {
      position = video.duration_seconds;
    }
    if (position < 0) {
      position = 0;
    }

    const updateData = {
      last_position_seconds: position,
      is_completed: data.is_completed
    };

    return progressRepository.upsert(userId, videoId, updateData);
  }
}

module.exports = new ProgressService();
