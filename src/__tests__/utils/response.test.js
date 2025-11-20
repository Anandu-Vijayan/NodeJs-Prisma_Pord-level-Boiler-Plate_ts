const { sendSuccess, sendError } = require('../../utilities/response');

describe('Response Utilities', () => {
  let mockRes;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe('sendSuccess', () => {
    it('should send success response with default values', () => {
      sendSuccess(mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Success',
        data: null,
      });
    });

    it('should send success response with custom data', () => {
      const data = { id: 1, name: 'Test' };
      sendSuccess(mockRes, data);

      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Success',
        data,
      });
    });

    it('should send success response with custom message', () => {
      sendSuccess(mockRes, null, 'Custom message');

      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Custom message',
        data: null,
      });
    });

    it('should send success response with custom status code', () => {
      sendSuccess(mockRes, null, 'Created', 201);

      expect(mockRes.status).toHaveBeenCalledWith(201);
    });
  });

  describe('sendError', () => {
    it('should send error response with default values', () => {
      sendError(mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Internal Server Error',
      });
    });

    it('should send error response with custom message', () => {
      sendError(mockRes, 'Custom error');

      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Custom error',
      });
    });

    it('should send error response with custom status code', () => {
      sendError(mockRes, 'Not Found', 404);

      expect(mockRes.status).toHaveBeenCalledWith(404);
    });

    it('should send error response with errors object', () => {
      const errors = { field: 'email', message: 'Invalid email' };
      sendError(mockRes, 'Validation failed', 400, errors);

      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation failed',
        errors,
      });
    });
  });
});
