const db = require('../../config/db');

class SectionRepository {
  async findById(id) {
    return db('sections').where('id', id).first();
  }

  async findBySubjectId(subjectId) {
    return db('sections')
      .where('subject_id', subjectId)
      .orderBy('order_index', 'asc');
  }

  async create(sectionData) {
    const [id] = await db('sections').insert({
      subject_id: sectionData.subject_id,
      title: sectionData.title,
      order_index: sectionData.order_index,
      created_at: new Date(),
      updated_at: new Date()
    });

    return this.findById(id);
  }

  async update(id, updates) {
    updates.updated_at = new Date();
    await db('sections').where('id', id).update(updates);
    return this.findById(id);
  }

  async delete(id) {
    return db('sections').where('id', id).del();
  }
}

module.exports = new SectionRepository();
