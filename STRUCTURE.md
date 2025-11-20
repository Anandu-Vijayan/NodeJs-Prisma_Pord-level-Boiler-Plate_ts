# Code Structure - Resource-Based Version Organization

This document describes the resource-based, versioned code structure of the boilerplate.

## Directory Structure

```
src/
├── v1/                          # API Version 1 - All v1 code lives here
│   ├── uploads/                 # Uploads resource
│   │   ├── controller.js        # Upload controller logic
│   │   ├── service.js           # Upload service (Cloudinary)
│   │   └── routes.js            # Upload routes
│   ├── users/                   # Users resource
│   │   ├── controller.js        # User controller logic
│   │   └── routes.js            # User routes
│   ├── auth/                    # Auth resource
│   │   ├── controller.js        # Auth controller logic
│   │   └── routes.js            # Auth routes
│   └── index.js                 # v1 router (aggregates all resources)
│
├── routes/
│   └── index.js                  # Main router (connects /api/v1 to v1 folder)
│
├── config/                       # Shared configuration
│   ├── cloudinary.js
│   ├── database.js
│   ├── env.js
│   └── swagger.js
│
├── middleware/                    # Shared middleware
│   ├── auth.js
│   ├── errorHandler.js
│   ├── notFound.js
│   ├── requestId.js
│   ├── requestLogger.js
│   └── security.js
│
├── models/                        # Shared models
│   └── User.js
│
├── utils/                         # Shared utilities
│   ├── asyncHandler.js
│   ├── errors.js
│   ├── fileUpload.js
│   ├── logger.js
│   ├── pagination.js
│   ├── response.js
│   └── validation.js
│
└── server.js                      # Application entry point
```

## Resource Organization

Each resource within `src/v1/` contains:

### Uploads Resource (`src/v1/uploads/`)
- **controller.js** - Handles upload requests (single, multiple, delete, transform)
- **service.js** - Cloudinary service layer (upload, delete operations)
- **routes.js** - Express routes for upload endpoints

### Users Resource (`src/v1/users/`)
- **controller.js** - Handles user CRUD operations
- **routes.js** - Express routes for user endpoints

### Auth Resource (`src/v1/auth/`)
- **controller.js** - Handles authentication (register, login, logout, getMe)
- **routes.js** - Express routes for auth endpoints

## API Endpoints

### Version 1 (v1)

**Base URL**: `/api/v1`

#### Uploads (`/api/v1/uploads`)
- `POST /api/v1/uploads` - Upload single file
- `POST /api/v1/uploads/multiple` - Upload multiple files
- `DELETE /api/v1/uploads/:publicId` - Delete file
- `DELETE /api/v1/uploads/multiple` - Delete multiple files
- `GET /api/v1/uploads/transform/:publicId` - Get transformed URL

#### Auth (`/api/v1/auth`)
- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/logout` - Logout user

#### Users (`/api/v1/users`)
- `GET /api/v1/users` - Get all users (admin)
- `GET /api/v1/users/:id` - Get single user
- `POST /api/v1/users` - Create user (admin)
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user (admin)

## Routing Flow

```
Request: /api/v1/uploads
  ↓
src/routes/index.js (main router)
  ↓
router.use('/api/v1', require('../v1'))
  ↓
src/v1/index.js (v1 router)
  ↓
router.use('/uploads', require('./uploads/routes'))
  ↓
src/v1/uploads/routes.js
  ↓
src/v1/uploads/controller.js
  ↓
src/v1/uploads/service.js (if needed)
```

## Import Paths

### From Resource Controllers

```javascript
// src/v1/uploads/controller.js
const uploadService = require('./service');  // Same resource
const asyncHandler = require('../../utils/asyncHandler');  // Shared utils
const { sendSuccess } = require('../../utils/response');  // Shared utils
```

### From Resource Routes

```javascript
// src/v1/uploads/routes.js
const { uploadSingle } = require('./controller');  // Same resource
const { protect } = require('../../middleware/auth');  // Shared middleware
const { uploadSingle: uploadSingleMiddleware } = require('../../utils/fileUpload');  // Shared utils
```

### From v1 Index

```javascript
// src/v1/index.js
router.use('/uploads', require('./uploads/routes'));  // Resource routes
router.use('/auth', require('./auth/routes'));  // Resource routes
router.use('/users', require('./users/routes'));  // Resource routes
```

## Adding a New Resource

### Step 1: Create Resource Directory

```bash
mkdir -p src/v1/products
```

### Step 2: Create Resource Files

```javascript
// src/v1/products/controller.js
const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/response');

const getProducts = asyncHandler(async (req, res) => {
  // Controller logic
});

module.exports = { getProducts };
```

```javascript
// src/v1/products/routes.js
const express = require('express');
const router = express.Router();
const { getProducts } = require('./controller');
const { protect } = require('../../middleware/auth');

router.get('/', protect, getProducts);

module.exports = router;
```

### Step 3: Register in v1 Router

```javascript
// src/v1/index.js
router.use('/products', require('./products/routes'));
```

## Adding a New Version

### Step 1: Create Version Directory

```bash
mkdir -p src/v2/uploads src/v2/users src/v2/auth
```

### Step 2: Create v2 Index

```javascript
// src/v2/index.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API v2 is working',
    version: '2.0.0',
  });
});

// Add v2 resources
router.use('/uploads', require('./uploads/routes'));

module.exports = router;
```

### Step 3: Register in Main Router

```javascript
// src/routes/index.js
router.use('/api/v1', require('../v1'));
router.use('/api/v2', require('../v2'));  // Add this
```

## Benefits of This Structure

1. **Resource Grouping** - All related code (controller, service, routes) in one place
2. **Version Isolation** - Each version is completely separate
3. **Easy Navigation** - Find all code for a resource in one directory
4. **Scalable** - Easy to add new resources or versions
5. **Maintainable** - Clear separation of concerns
6. **Clean Imports** - Relative paths are intuitive

## Best Practices

1. **Keep resources self-contained** - Each resource folder should have everything it needs
2. **Use services for external APIs** - Keep business logic in controllers, external calls in services
3. **Share common code** - Utils, middleware, models stay outside version folders
4. **Consistent naming** - Use `controller.js`, `routes.js`, `service.js` consistently
5. **Document routes** - Use Swagger comments in route files

## File Naming Conventions

- **Controllers**: `controller.js`
- **Routes**: `routes.js`
- **Services**: `service.js`
- **Models**: `model.js` (if resource-specific)
- **Validators**: `validators.js` (if resource-specific)

## Example: Complete Resource Structure

```
src/v1/products/
├── controller.js      # Product CRUD operations
├── service.js         # External API calls (if needed)
├── routes.js          # Product routes
├── validators.js      # Product-specific validators (optional)
└── model.js           # Product model (if resource-specific)
```

This structure makes it easy to:
- Find all code related to a resource
- Add new resources
- Maintain version separation
- Scale to multiple versions
