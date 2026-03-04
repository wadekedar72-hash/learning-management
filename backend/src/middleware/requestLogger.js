function requestLogger(req, res, next) {
  const timestamp = new Date().toISOString();
  const { method, url } = req;
  const userAgent = req.get('user-agent') || 'unknown';
  
  console.log(`[${timestamp}] ${method} ${url} - ${userAgent}`);
  
  next();
}

module.exports = requestLogger;
