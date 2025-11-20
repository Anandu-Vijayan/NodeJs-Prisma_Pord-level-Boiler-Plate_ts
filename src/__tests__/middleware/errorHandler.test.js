const errorHandler = require('../../v1.0/middleware/errorHandler');
const { sendError } = require('../../utilities/response');

// Mock the response utility
jest.mock('../../utilities/response', () => ({
  sendError: jest.fn(),
}));

describe('Error Handler Middleware', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  it('should handle CastError (invalid ObjectId)', () => {
    const err = {
      name: 'CastError',
      message: 'Cast to ObjectId failed',
    };

    errorHandler(err, mockReq, mockRes, mockNext);

    expect(sendError).toHaveBeenCalledWith(
      mockRes,
      'Resource not found',
      404,
      undefined,
    );
  });

  it('should handle duplicate key error', () => {
    const err = {
      code: 11000,
      message: 'Duplicate key error',
    };

    errorHandler(err, mockReq, mockRes, mockNext);

    expect(sendError).toHaveBeenCalledWith(
      mockRes,
      'Duplicate field value entered',
      400,
      undefined,
    );
  });

  it('should handle ValidationError', () => {
    const err = {
      name: 'ValidationError',
      errors: {
        email: { message: 'Email is required' },
        password: { message: 'Password is required' },
      },
    };

    errorHandler(err, mockReq, mockRes, mockNext);

    expect(sendError).toHaveBeenCalledWith(
      mockRes,
      expect.stringContaining('Email is required'),
      400,
      undefined,
    );
  });

  it('should handle JsonWebTokenError', () => {
    const err = {
      name: 'JsonWebTokenError',
      message: 'Invalid token',
    };

    errorHandler(err, mockReq, mockRes, mockNext);

    expect(sendError).toHaveBeenCalledWith(
      mockRes,
      'Invalid token',
      401,
      undefined,
    );
  });

  it('should handle TokenExpiredError', () => {
    const err = {
      name: 'TokenExpiredError',
      message: 'Token expired',
    };

    errorHandler(err, mockReq, mockRes, mockNext);

    expect(sendError).toHaveBeenCalledWith(
      mockRes,
      'Token expired',
      401,
      undefined,
    );
  });

  it('should handle generic errors', () => {
    const err = {
      message: 'Generic error',
      stack: 'Error stack trace',
    };

    errorHandler(err, mockReq, mockRes, mockNext);

    // In test mode, stack traces are not included (same as production)
    expect(sendError).toHaveBeenCalledWith(
      mockRes,
      'Generic error',
      500,
      undefined,
    );
  });
});
