const db = require('../../config/db');

class ProgressRepository {
  async findByUserAndVideo(userId, videoId) {
    return db('video_progress')
      .where({
        user_id: userId,
        video_id: videoId
      })
      .first();
  }

  async findByUserAndSubject(userId, subjectId) {
    return db('video_progress')
      .select('video_progress.*')
      .join('videos', 'video_progress.video_id', 'videos.id')
      .join('sections', 'videos.section_id', 'sections.id')
      .where({
        'video_progress.user_id': userId,
        'sections.subject_id': subjectId
      });
  }

  async upsert(userId, videoId, data) {
    const existing = await this.findByUserAndVideo(userId, videoId);

    if (existing) {
      const updates = {
        last_position_seconds: data.last_position_seconds,
        updated_at: new Date()
      };

      if (data.is_completed !== undefined) {
        updates.is_completed = data.is_completed;
        if (data.is_completed && !existing.is_completed) {
          updates.completed_at = new Date();
        }
      }

      await db('video_progress')
        .where({ id: existing.id })
        .update(updates);

      return this.findByUserAndVideo(userId, videoId);
    } else {
      const insertData = {
        user_id: userId,
        video_id: videoId,
        last_position_seconds: data.last_position_seconds || 0,
        is_completed: data.is_completed || false,
        created_at: new Date(),
        updated_at: new Date()
      };

      if (data.is_completed) {
        insertData.completed_at = new Date();
      }

      const [id] = await db('video_progress').insert(insertData);
      return this.findById(id);
    }
  }

  async findById(id) {
    return db('video_progress').where('id', id).first();
  }

  async getSubjectStats(userId, subjectId) {
    // Get total videos in subject
    const totalResult = await db('videos')
      .count('videos.id as count')
      .join('sections', 'videos.section_id', 'sections.id')
      .where('sections.subject_id', subjectId)
      .first();

    // Get completed videos
    const completedResult = await db('video_progress')
      .count('video_progress.id as count')
      .join('videos', 'video_progress.video_id', 'videos.id')
      .join('sections', 'videos.section_id', 'sections.id')
      .where({
        'video_progress.user_id': userId,
        'sections.subject_id': subjectId,
        'video_progress.is_completed': true
      })
      .first();

    const totalVideos = parseInt(totalResult.count, 10);
    const completedVideos = parseInt(completedResult.count, 10);
    const percentComplete = totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;

    // Get last watched video
    const lastProgress = await db('video_progress')
      .select('video_progress.video_id', 'video_progress.last_position_seconds')
      .join('videos', 'video_progress.video_id', 'videos.id')
      .join('sections', 'videos.section_id', 'sections.id')
      .where({
        'video_progress.user_id': userId,
        'sections.subject_id': subjectId
      })
      .orderBy('video_progress.updated_at', 'desc')
      .first();

    return {
      total_videos: totalVideos,
      completed_videos: completedVideos,
      percent_complete: percentComplete,
      last_video_id: lastProgress?.video_id || null,
      last_position_seconds: lastProgress?.last_position_seconds || 0
    };
  }
}

module.exports = new ProgressRepository();
