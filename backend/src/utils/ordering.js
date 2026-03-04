const db = require('../config/db');

/**
 * Get all videos in a subject ordered by section.order_index, then video.order_index
 * Returns flattened array with section info
 */
async function getGlobalVideoOrder(subjectId) {
  const videos = await db('videos')
    .select(
      'videos.id as video_id',
      'videos.title as video_title',
      'videos.order_index as video_order',
      'videos.section_id',
      'sections.order_index as section_order'
    )
    .join('sections', 'videos.section_id', 'sections.id')
    .where('sections.subject_id', subjectId)
    .orderBy('sections.order_index', 'asc')
    .orderBy('videos.order_index', 'asc');

  return videos.map((v, index) => ({
    ...v,
    global_index: index
  }));
}

/**
 * Get the previous video ID in the global sequence
 */
async function getPreviousVideoId(videoId, subjectId) {
  const orderedVideos = await getGlobalVideoOrder(subjectId);
  const currentIndex = orderedVideos.findIndex(v => v.video_id === videoId);
  
  if (currentIndex <= 0) {
    return null;
  }
  
  return orderedVideos[currentIndex - 1].video_id;
}

/**
 * Get the next video ID in the global sequence
 */
async function getNextVideoId(videoId, subjectId) {
  const orderedVideos = await getGlobalVideoOrder(subjectId);
  const currentIndex = orderedVideos.findIndex(v => v.video_id === videoId);
  
  if (currentIndex === -1 || currentIndex >= orderedVideos.length - 1) {
    return null;
  }
  
  return orderedVideos[currentIndex + 1].video_id;
}

/**
 * Get the prerequisite video ID (previous video in sequence)
 */
async function getPrerequisiteVideoId(videoId, subjectId) {
  return getPreviousVideoId(videoId, subjectId);
}

/**
 * Check if a video is unlocked for a user
 * A video is unlocked if:
 * - It's the first video (no prerequisite), OR
 * - The prerequisite video is completed
 */
async function isVideoUnlocked(videoId, userId, subjectId) {
  const prerequisiteId = await getPrerequisiteVideoId(videoId, subjectId);
  
  // First video has no prerequisite
  if (!prerequisiteId) {
    return true;
  }
  
  // Check if prerequisite is completed
  const progress = await db('video_progress')
    .where({
      user_id: userId,
      video_id: prerequisiteId
    })
    .first();
  
  return progress?.is_completed === true;
}

/**
 * Get the first video ID in a subject
 */
async function getFirstVideoId(subjectId) {
  const orderedVideos = await getGlobalVideoOrder(subjectId);
  return orderedVideos.length > 0 ? orderedVideos[0].video_id : null;
}

/**
 * Get the first unlocked video ID for a user
 */
async function getFirstUnlockedVideoId(subjectId, userId) {
  const orderedVideos = await getGlobalVideoOrder(subjectId);
  
  for (const video of orderedVideos) {
    const isUnlocked = await isVideoUnlocked(video.video_id, userId, subjectId);
    if (isUnlocked) {
      return video.video_id;
    }
  }
  
  return null;
}

/**
 * Get full tree with locked/unlocked status for a user
 */
async function getSubjectTreeWithStatus(subjectId, userId) {
  const subject = await db('subjects')
    .where({ id: subjectId, is_published: true })
    .first();
  
  if (!subject) {
    return null;
  }
  
  const sections = await db('sections')
    .where('subject_id', subjectId)
    .orderBy('order_index', 'asc');
  
  const treeSections = [];
  
  for (const section of sections) {
    const videos = await db('videos')
      .where('section_id', section.id)
      .orderBy('order_index', 'asc');
    
    const videosWithStatus = [];
    
    for (const video of videos) {
      const progress = await db('video_progress')
        .where({
          user_id: userId,
          video_id: video.id
        })
        .first();
      
      const isUnlocked = await isVideoUnlocked(video.id, userId, subjectId);
      
      videosWithStatus.push({
        id: video.id,
        title: video.title,
        order_index: video.order_index,
        duration_seconds: video.duration_seconds,
        is_completed: progress?.is_completed || false,
        locked: !isUnlocked
      });
    }
    
    treeSections.push({
      id: section.id,
      title: section.title,
      order_index: section.order_index,
      videos: videosWithStatus
    });
  }
  
  return {
    id: subject.id,
    title: subject.title,
    slug: subject.slug,
    description: subject.description,
    sections: treeSections
  };
}

module.exports = {
  getGlobalVideoOrder,
  getPreviousVideoId,
  getNextVideoId,
  getPrerequisiteVideoId,
  isVideoUnlocked,
  getFirstVideoId,
  getFirstUnlockedVideoId,
  getSubjectTreeWithStatus
};
