const subjectService = require('./subject.service');

class SubjectController {
  async getAll(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const q = req.query.q || null;

      const result = await subjectService.getAllSubjects({ page, pageSize, search: q });

      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { subjectId } = req.params;
      const subject = await subjectService.getSubjectById(subjectId);

      res.json({
        success: true,
        data: subject
      });
    } catch (error) {
      next(error);
    }
  }

  async getTree(req, res, next) {
    try {
      const { subjectId } = req.params;
      const userId = req.user.id;

      const tree = await subjectService.getSubjectTree(subjectId, userId);

      res.json({
        success: true,
        data: tree
      });
    } catch (error) {
      next(error);
    }
  }

  async getFirstVideo(req, res, next) {
    try {
      const { subjectId } = req.params;
      const userId = req.user.id;

      const result = await subjectService.getFirstVideo(subjectId, userId);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SubjectController();
