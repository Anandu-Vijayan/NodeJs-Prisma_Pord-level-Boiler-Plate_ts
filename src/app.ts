/**
 * Main Express Application
 * Application initialization and middleware setup
 */

import express, { Express } from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import config from './config/env';
import connectDB, { prisma } from './config/database';
import logger from './utilities/logger';
import securityMiddleware from './v1.0/middleware/security';
import requestId from './v1.0/middleware/requestId';
import requestLogger from './v1.0/middleware/requestLogger';
import errorHandler from './v1.0/middleware/errorHandler';
import notFound from './v1.0/middleware/notFound';
import routes from './route';
import { startAutoSeed, stopAutoSeed } from './config/autoSeed';

// Initialize Express app
const app: Express = express();

// Connect to database (skip in test mode - tests handle their own DB)
if (config.NODE_ENV !== 'test') {
  connectDB();
}

// Trust proxy (for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// Request ID middleware (must be first)
app.use(requestId);

// Compression middleware
app.use(compression());

// Cookie parser
app.use(cookieParser());

// HTTP request logger
if (config.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    stream: {
      write: (message: string) => logger.info(message.trim()),
    },
  }));
}

// Enhanced request logging
app.use(requestLogger);

// Security middleware
securityMiddleware(app);

// Body parser (must be before routes)
app.use(express.json({
  limit: '10mb', 
  strict: true,
  type: 'application/json',
}));
app.use(express.urlencoded({
  extended: true,
  limit: '10mb',
  parameterLimit: 1000,
}));

// Serve static files from public directory
app.use(express.static('public'));

// Routes
app.use('/', routes);

// 404 handler
app.use(notFound);

// Error handler (must be last)
app.use(errorHandler);

// Start server (only if not in test mode)
let server: ReturnType<typeof app.listen> | undefined;
let autoSeedInterval: NodeJS.Timeout | null = null;

if (config.NODE_ENV !== 'test') {
  server = app.listen(config.PORT, () => {
    logger.info(`Server running in ${config.NODE_ENV} mode on port ${config.PORT}`);
    logger.info(`Environment: ${config.NODE_ENV}`);
    logger.info(`Process ID: ${process.pid}`);
  });

  // Start periodic auto-seeding if enabled
  const intervalMinutes = parseInt(process.env.PRISMA_AUTO_SEED_INTERVAL || '60', 10);
  autoSeedInterval = startAutoSeed(intervalMinutes);
} 

// Graceful shutdown handler (only if server is running)
if (server) {
  const gracefulShutdown = (signal: string): void => {
    logger.info(`${signal} received. Starting graceful shutdown...`);

    // Stop auto-seeding
    if (autoSeedInterval) {
      stopAutoSeed(autoSeedInterval);
    }

    server?.close(async () => {
      logger.info('HTTP server closed');

      // Close database connection
      try {
        await prisma.$disconnect();
        logger.info('Database connection closed');
      } catch (error) {
        logger.info('Database connection closed');
      }
      process.exit(0);
    });

    // Force close after 10 seconds
    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  };

  // Listen for termination signals
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err: Error) => {
    logger.error(`Unhandled Rejection: ${err.message}`);
    server?.close(() => {
      process.exit(1);
    });
  }); 

  // Handle uncaught exceptions
  process.on('uncaughtException', (err: Error) => {
    logger.error(`Uncaught Exception: ${err.message}`);
    process.exit(1);
  });
}

export default app;