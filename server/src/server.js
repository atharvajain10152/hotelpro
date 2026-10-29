import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`\n======================================================`);
      console.log(`  HOTELPRO API SERVER RUNNING ON PORT: ${PORT}`);
      console.log(`  Health Check: http://localhost:${PORT}/health`);
      console.log(`  API Base:     http://localhost:${PORT}/api/v1`);
      console.log(`======================================================\n`);
    });

    process.on('unhandledRejection', (err) => {
      console.error(`[Server Unhandled Rejection]: ${err.message}`);
      // Keep running in development
    });

    process.on('SIGTERM', () => {
      console.log('[Server] SIGTERM received. Gracefully shutting down...');
      server.close(() => {
        console.log('[Server] Process terminated.');
      });
    });
  } catch (err) {
    console.error(`[Server Start Error]: ${err.message}`);
    process.exit(1);
  }
};

startServer();
