const db = require('../../config/db');

class SubjectRepository {
  async findAll({ page = 1, pageSize = 10, search = null }) {
    const query = db('subjects')
      .where('is_published', true)
      .orderBy('created_at', 'desc');

    if (search) {
      query.where(function() {
        this.where('title', 'like', `%${search}%`)
          .orWhere('description', 'like', `%${search}%`);
      });
    }

    const countQuery = query.clone();
    const total = await countQuery.count('* as count').first();

    const subjects = await query
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    return {
      data: subjects,
      pagination: {
        page,
        pageSize,
        total: total.count,
        totalPages: Math.ceil(total.count / pageSize)
      }
    };
  }

  async findById(id) {
    return db('subjects').where('id', id).first();
  }

  async findBySlug(slug) {
    return db('subjects').where('slug', slug).first();
  }

  async create(subjectData) {
    const [id] = await db('subjects').insert({
      title: subjectData.title,
      slug: subjectData.slug,
      description: subjectData.description,
      is_published: subjectData.is_published || false,
      created_at: new Date(),
      updated_at: new Date()
    });

    return this.findById(id);
  }

  async update(id, updates) {
    updates.updated_at = new Date();
    await db('subjects').where('id', id).update(updates);
    return this.findById(id);
  }

  async delete(id) {
    return db('subjects').where('id', id).del();
  }

  async getSections(subjectId) {
    return db('sections')
      .where('subject_id', subjectId)
      .orderBy('order_index', 'asc');
  }
}

module.exports = new SubjectRepository();
