# Final Project Structure

This document describes the final, clean architecture of the boilerplate.

## Directory Structure

```
src/
├── config/              # Configuration files (env, db, etc.)
│   ├── database.js      # MongoDB connection
│   ├── env.js           # Environment variables
│   ├── cloudinary.js    # Cloudinary configuration
│   └── swagger.js       # Swagger/OpenAPI configuration
│
├── public/              # Static files, images, assets
│   └── (static files)
│
├── route/               # Global route definitions and middleware setup
│   └── index.js         # Centralized routing
│
├── utilities/           # Helper functions (reusable across project)
│   ├── asyncHandler.js
│   ├── errors.js
│   ├── fileUpload.js
│   ├── logger.js
│   ├── pagination.js
│   ├── response.js
│   └── validation.js
│
├── storage/             # All file/image storage logic/middleware
│   ├── index.js         # Storage module exports (Multer)
│   └── cloudinary.js    # Cloudinary service
│
├── middleware/          # Express middleware
│   ├── auth.js
│   ├── errorHandler.js
│   ├── notFound.js
│   ├── requestId.js
│   ├── requestLogger.js
│   └── security.js
│
├── models/              # Database models
│   └── User.js
│
├── v1.0/                # API Version 1.0 - All version-specific code
│   ├── controller/      # Request handler functions for v1.0
│   │   ├── uploads.js
│   │   ├── auth.js
│   │   └── users.js
│   ├── helpers/         # Custom utilities used only by v1.0
│   │   ├── auth.js      # JWT token generation
│   │   └── validation.js # v1.0 validation rules
│   └── routes.js        # v1.0 route definitions
│
└── app.js               # Main Express app initialization
```

## Key Features

### 1. Centralized Configuration (`config/`)
- Environment variables
- Database connection
- Third-party service configs (Cloudinary, Swagger)

### 2. Modular Storage (`storage/`)
- Multer middleware configuration
- Cloudinary service integration
- File upload/delete operations
- Reusable across all versions

### 3. Shared Utilities (`utilities/`)
- Error handling
- Logging
- Response formatting
- Pagination
- Validation helpers

### 4. Version-Specific Code (`v1.0/`)
- **Controllers**: Business logic handlers
- **Helpers**: Version-specific utilities
- **Routes**: Endpoint mapping

### 5. Centralized Routing (`route/`)
- Health check
- API documentation
- Version routing (`/api/v1.0/*` → `v1.0/routes.js`)

## API Endpoints

### Version 1.0

**Base URL**: `/api/v1.0`

- **Uploads**: `/api/v1.0/uploads/*`
- **Auth**: `/api/v1.0/auth/*`
- **Users**: `/api/v1.0/users/*`

## File Upload Example

The storage module provides complete file upload functionality:

```javascript
// In v1.0/routes.js
const { uploadSingle, handleMulterError } = require('../../storage');

router.post('/uploads',
  protect,
  uploadSingle('file'),
  handleMulterError,
  uploadsController.uploadSingle
);
```

## Import Patterns

### From v1.0 Controllers
```javascript
const asyncHandler = require('../../utilities/asyncHandler');
const { sendSuccess } = require('../../utilities/response');
const { cloudinaryService } = require('../../storage');
const { generateToken } = require('../helpers/auth');
```

### From v1.0 Routes
```javascript
const { protect } = require('../../middleware/auth');
const { uploadSingle } = require('../../storage');
const uploadsController = require('./controller/uploads');
```

## Benefits

✅ **Clean Separation**: Each layer has a clear purpose  
✅ **Easy Navigation**: Find code quickly by purpose  
✅ **Scalable**: Easy to add features or versions  
✅ **Maintainable**: Changes isolated to specific layers  
✅ **Reusable**: Storage, utilities shared across versions  
✅ **Modular**: Storage logic centralized and reusable  

This structure follows best practices for clean code, separation of concerns, and business logic layering.

