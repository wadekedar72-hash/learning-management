class HealthController {
  async check(req, res) {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = new HealthController();
