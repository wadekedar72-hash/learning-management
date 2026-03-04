const app = require('./app');
const env = require('./config/env');
const db = require('./config/db');

const PORT = env.PORT;

async function startServer() {
  try {
    // Test database connection
    await db.raw('SELECT 1');
    console.log('Database connected successfully');

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
