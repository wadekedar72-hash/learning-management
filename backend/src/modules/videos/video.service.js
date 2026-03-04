const videoRepository = require('./video.repository');
const { getPreviousVideoId, getNextVideoId, isVideoUnlocked, getPrerequisiteVideoId } = require('../../utils/ordering');

class VideoService {
  async getVideoById(videoId, userId) {
    const video = await videoRepository.findByIdWithDetails(videoId);
    
    if (!video) {
      throw Object.assign(new Error('Video not found'), { status: 404 });
    }

    const subjectId = video.subject_id;

    // Get prev/next videos
    const previous_video_id = await getPreviousVideoId(videoId, subjectId);
    const next_video_id = await getNextVideoId(videoId, subjectId);
    const prerequisite_video_id = await getPrerequisiteVideoId(videoId, subjectId);

    // Check if video is unlocked
    const isUnlocked = await isVideoUnlocked(videoId, userId, subjectId);

    return {
      id: video.id,
      title: video.title,
      description: video.description,
      youtube_video_id: video.youtube_video_id,
      order_index: video.order_index,
      duration_seconds: video.duration_seconds,
      section_id: video.section_id,
      section_title: video.section_title,
      subject_id: video.subject_id,
      subject_title: video.subject_title,
      previous_video_id,
      next_video_id,
      locked: !isUnlocked,
      unlock_reason: !isUnlocked && prerequisite_video_id 
        ? 'Complete the previous video to unlock this one'
        : null
    };
  }
}

module.exports = new VideoService();
