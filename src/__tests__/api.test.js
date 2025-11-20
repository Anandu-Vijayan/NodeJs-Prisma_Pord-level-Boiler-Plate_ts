const request = require('supertest');
const appModule = require('../app');
const app = appModule.default || appModule;
const { connectTestDB, closeTestDB } = require('./utils/testHelpers');

describe('API Endpoints', () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await closeTestDB();
  });
  describe('GET /api/v1.0/', () => {
    it('should return API information', async () => {
      const response = await request(app).get('/api/v1.0/');

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('API v1.0 is working');
      expect(response.body.version).toBe('1.0.0');
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app).get('/api/v1.0/nonexistent');

      expect(response.statusCode).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });
  });
});
