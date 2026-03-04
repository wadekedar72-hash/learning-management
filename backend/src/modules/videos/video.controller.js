const videoService = require('./video.service');

class VideoController {
  async getById(req, res, next) {
    try {
      const { videoId } = req.params;
      const userId = req.user.id;

      const video = await videoService.getVideoById(videoId, userId);

      res.json({
        success: true,
        data: video
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new VideoController();
