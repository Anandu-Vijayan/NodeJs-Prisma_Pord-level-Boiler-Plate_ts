/**
 * Centralized Routing
 * Global route definitions and middleware setup
 */

import express, { Request, Response } from 'express';
import os from 'os';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../config/swagger';
import { prisma } from '../config/database';
import v1Routes from '../v1.0/routes';

const router = express.Router();

// Swagger API Documentation
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check route with database status
/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is healthy
 *       503:
 *         description: Server is unhealthy
 */
router.get('/health', async (_req: Request, res: Response) => {
  let dbStatus = 'disconnected';
  let dbError = null;

  try {
    // Test database connection (MongoDB doesn't support $queryRaw)
    // Use a simple findOne operation instead
    await prisma.user.findFirst();
    dbStatus = 'connected';
  } catch (error) {
    dbStatus = 'disconnected';
    dbError = (error as Error).message;
  }

  const healthCheck = {
    success: dbStatus === 'connected',
    message: dbStatus === 'connected' ? 'Server is running' : 'Server is running but database is disconnected',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0',
    process: {
      pid: process.pid,
      memory: {
        used: Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
        total: Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100,
        rss: Math.round((process.memoryUsage().rss / 1024 / 1024) * 100) / 100,
      },
      cpu: process.cpuUsage(),
    },
    system: {
      platform: os.platform(),
      arch: os.arch(),
      cpus: os.cpus().length,
      loadAverage: os.loadavg(),
      totalMemory: Math.round((os.totalmem() / 1024 / 1024 / 1024) * 100) / 100,
      freeMemory: Math.round((os.freemem() / 1024 / 1024 / 1024) * 100) / 100,
    },
    database: {
      status: dbStatus,
      error: dbError,
    },
  };

  const statusCode = dbStatus === 'connected' ? 200 : 503;
  res.status(statusCode).json(healthCheck);
});

// API Version Routes
router.use('/api/v1.0', v1Routes);

export default router;

