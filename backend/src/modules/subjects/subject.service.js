const subjectRepository = require('./subject.repository');
const { getSubjectTreeWithStatus, getFirstUnlockedVideoId } = require('../../utils/ordering');

class SubjectService {
  async getAllSubjects(filters) {
    return subjectRepository.findAll(filters);
  }

  async getSubjectById(id) {
    const subject = await subjectRepository.findById(id);
    if (!subject) {
      throw Object.assign(new Error('Subject not found'), { status: 404 });
    }
    return subject;
  }

  async getSubjectTree(subjectId, userId) {
    const tree = await getSubjectTreeWithStatus(subjectId, userId);
    if (!tree) {
      throw Object.assign(new Error('Subject not found'), { status: 404 });
    }
    return tree;
  }

  async getFirstVideo(subjectId, userId) {
    const subject = await subjectRepository.findById(subjectId);
    if (!subject) {
      throw Object.assign(new Error('Subject not found'), { status: 404 });
    }

    const firstVideoId = await getFirstUnlockedVideoId(subjectId, userId);
    return { video_id: firstVideoId };
  }
}

module.exports = new SubjectService();
