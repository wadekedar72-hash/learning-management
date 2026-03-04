const db = require('../../config/db');

class VideoRepository {
  async findById(id) {
    return db('videos').where('id', id).first();
  }

  async findBySectionId(sectionId) {
    return db('videos')
      .where('section_id', sectionId)
      .orderBy('order_index', 'asc');
  }

  async findByIdWithDetails(id) {
    return db('videos')
      .select(
        'videos.*',
        'sections.title as section_title',
        'sections.subject_id',
        'subjects.title as subject_title'
      )
      .join('sections', 'videos.section_id', 'sections.id')
      .join('subjects', 'sections.subject_id', 'subjects.id')
      .where('videos.id', id)
      .first();
  }

  async create(videoData) {
    const [id] = await db('videos').insert({
      section_id: videoData.section_id,
      title: videoData.title,
      description: videoData.description,
      youtube_video_id: videoData.youtube_video_id,
      order_index: videoData.order_index,
      duration_seconds: videoData.duration_seconds,
      created_at: new Date(),
      updated_at: new Date()
    });

    return this.findById(id);
  }

  async update(id, updates) {
    updates.updated_at = new Date();
    await db('videos').where('id', id).update(updates);
    return this.findById(id);
  }

  async delete(id) {
    return db('videos').where('id', id).del();
  }
}

module.exports = new VideoRepository();
