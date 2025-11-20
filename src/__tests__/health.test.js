const request = require('supertest');
const appModule = require('../app');
const app = appModule.default || appModule;
const { connectTestDB, closeTestDB } = require('./utils/testHelpers');

describe('Health Check Endpoint', () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  describe('GET /health', () => {
    it('should return 200 status code', async () => {
      const response = await request(app).get('/health');
      expect(response.statusCode).toBe(200);
    });

    it('should return success true', async () => {
      const response = await request(app).get('/health');
      expect(response.body.success).toBe(true);
    });

    it('should return server running message', async () => {
      const response = await request(app).get('/health');
      expect(response.body.message).toBe('Server is running');
    });

    it('should return timestamp', async () => {
      const response = await request(app).get('/health');
      expect(response.body.timestamp).toBeDefined();
      expect(new Date(response.body.timestamp).getTime()).toBeGreaterThan(0);
    });
  });
});
