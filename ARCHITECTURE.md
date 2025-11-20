# Project Architecture

This document describes the clean, layered architecture of the boilerplate.

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
│   ├── logger.js
│   ├── pagination.js
│   ├── response.js
│   └── validation.js
│
├── storage/             # All file/image storage logic/middleware
│   ├── index.js         # Storage module exports
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
│   │   ├── auth.js      # Auth-specific helpers (JWT generation)
│   │   └── validation.js # v1.0 validation rules
│   └── routes.js        # v1.0 route definitions
│
└── app.js               # Main Express app initialization
```

## Architecture Layers

### 1. Configuration Layer (`config/`)
- **Purpose**: Centralized configuration management
- **Files**: Database, environment variables, third-party services
- **Reusability**: Used across all layers

### 2. Public Assets Layer (`public/`)
- **Purpose**: Serve static files (images, CSS, JS, etc.)
- **Access**: Direct HTTP access via Express static middleware

### 3. Routing Layer (`route/`)
- **Purpose**: Centralized route definitions and middleware setup
- **Responsibilities**:
  - Health check endpoints
  - API documentation (Swagger)
  - Version routing (`/api/v1.0/*` → `v1.0/routes.js`)

### 4. Utilities Layer (`utilities/`)
- **Purpose**: Reusable helper functions across the project
- **Examples**: Error handling, logging, response formatting, pagination
- **Reusability**: Shared across all versions and features

### 5. Storage Layer (`storage/`)
- **Purpose**: File/image storage logic and middleware
- **Components**:
  - Multer middleware configuration
  - Cloudinary service integration
  - File upload/delete operations
- **Reusability**: Used by any version that needs file storage

### 6. Middleware Layer (`middleware/`)
- **Purpose**: Express middleware functions
- **Examples**: Authentication, error handling, request logging, security
- **Reusability**: Applied globally or per-route

### 7. Models Layer (`models/`)
- **Purpose**: Database models (Mongoose schemas)
- **Reusability**: Shared across all versions

### 8. Version-Specific Layer (`v1.0/`)
- **Purpose**: All code specific to API version 1.0
- **Structure**:
  - **controller/**: Business logic handlers
  - **helpers/**: Version-specific utilities
  - **routes.js**: Endpoint mapping for v1.0

## Request Flow

```
HTTP Request
    ↓
app.js (Express initialization)
    ↓
route/index.js (Centralized routing)
    ↓
v1.0/routes.js (Version-specific routing)
    ↓
v1.0/controller/*.js (Business logic)
    ↓
v1.0/helpers/*.js (Version-specific utilities)
    ↓
storage/*.js (File operations, if needed)
    ↓
utilities/*.js (Shared utilities)
    ↓
models/*.js (Database operations)
    ↓
Response
```

## File Upload Flow (Example)

```
POST /api/v1.0/uploads
    ↓
route/index.js → routes to v1.0
    ↓
v1.0/routes.js → /uploads endpoint
    ↓
storage/index.js → uploadSingle middleware (Multer)
    ↓
v1.0/controller/uploads.js → uploadSingle handler
    ↓
storage/cloudinary.js → uploadBuffer (Cloudinary)
    ↓
Response with file URL
```

## Separation of Concerns

### Controllers (`v1.0/controller/`)
- **Responsibility**: Handle HTTP requests and responses
- **What they do**:
  - Extract request data
  - Call business logic
  - Format responses
  - Handle errors

### Helpers (`v1.0/helpers/`)
- **Responsibility**: Version-specific utility functions
- **What they do**:
  - Provide reusable functions for controllers
  - Version-specific business logic
  - Custom validations

### Storage (`storage/`)
- **Responsibility**: File storage operations
- **What they do**:
  - Multer middleware configuration
  - Cloudinary integration
  - File upload/delete operations

### Utilities (`utilities/`)
- **Responsibility**: Shared helper functions
- **What they do**:
  - Error handling
  - Logging
  - Response formatting
  - Common validations

## Best Practices

### 1. Version Isolation
- All v1.0 code lives in `v1.0/`
- No cross-version dependencies
- Easy to add v2.0, v3.0, etc.

### 2. Modular Storage
- Storage logic centralized in `storage/`
- Reusable across versions
- Easy to switch storage providers

### 3. Clean Imports
```javascript
// From v1.0 controller
const { cloudinaryService } = require('../../storage');
const { generateToken } = require('../helpers/auth');
const asyncHandler = require('../../utilities/asyncHandler');
```

### 4. Layered Architecture
- **Controllers**: Request/response handling
- **Helpers**: Version-specific logic
- **Storage**: File operations
- **Utilities**: Shared functions
- **Models**: Data access

### 5. Centralized Routing
- All routes defined in `route/index.js`
- Version routes in `v1.0/routes.js`
- Clean endpoint mapping

## Adding a New Feature

### Example: Adding "Products" to v1.0

1. **Create Controller**:
```javascript
// src/v1.0/controller/products.js
const asyncHandler = require('../../utilities/asyncHandler');
const { sendSuccess } = require('../../utilities/response');

const getProducts = asyncHandler(async (req, res) => {
  // Business logic
});

module.exports = { getProducts };
```

2. **Add Route**:
```javascript
// src/v1.0/routes.js
const productsController = require('./controller/products');

router.get('/products', protect, productsController.getProducts);
```

3. **Add Helper (if needed)**:
```javascript
// src/v1.0/helpers/products.js
const calculatePrice = (basePrice, discount) => {
  // Version-specific logic
};

module.exports = { calculatePrice };
```

## Adding a New Version

1. **Create Version Directory**:
```bash
mkdir -p src/v2.0/controller src/v2.0/helpers
```

2. **Create Version Routes**:
```javascript
// src/v2.0/routes.js
const express = require('express');
const router = express.Router();
// ... routes
module.exports = router;
```

3. **Register in Central Router**:
```javascript
// src/route/index.js
router.use('/api/v2.0', require('../v2.0/routes'));
```

## Benefits

1. **Clean Separation**: Each layer has a clear purpose
2. **Easy Navigation**: Find code quickly by purpose
3. **Scalable**: Easy to add features or versions
4. **Maintainable**: Changes isolated to specific layers
5. **Reusable**: Storage, utilities, models shared across versions
6. **Testable**: Each layer can be tested independently

## Configuration

All configuration is centralized in `config/`:
- Environment variables: `config/env.js`
- Database: `config/database.js`
- Cloudinary: `config/cloudinary.js`
- Swagger: `config/swagger.js`

## Storage Module

The storage module (`storage/`) provides:
- Multer middleware for file uploads
- Cloudinary service for cloud storage
- File validation and error handling
- Reusable across all versions

## Example Usage

### File Upload
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

### Using Helpers
```javascript
// In v1.0/controller/auth.js
const { generateToken } = require('../helpers/auth');

const token = generateToken(user._id);
```

This architecture ensures clean code, separation of concerns, and scalability.

