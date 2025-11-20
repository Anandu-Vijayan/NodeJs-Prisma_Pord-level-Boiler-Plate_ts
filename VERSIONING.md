# API Versioning Structure

This document explains the versioned code structure of the boilerplate.

## Directory Structure

```
src/
├── routes/
│   ├── v1/              # API Version 1 routes
│   │   ├── index.js     # v1 route aggregator
│   │   ├── upload.js    # v1 upload routes
│   │   ├── auth.js      # v1 auth routes
│   │   └── users.js     # v1 user routes
│   ├── v2/              # API Version 2 routes (future)
│   │   └── index.js     # v2 route aggregator
│   ├── index.js         # Main router (routes to versions)
│   └── api.js           # Deprecated (backward compatibility)
│
├── controllers/
│   ├── v1/              # Version 1 controllers
│   │   ├── uploadController.js
│   │   ├── authController.js
│   │   └── userController.js
│   ├── v2/              # Version 2 controllers (future)
│   └── ...              # Shared controllers (if any)
│
├── services/
│   ├── v1/              # Version 1 services
│   │   └── cloudinaryService.js
│   ├── v2/              # Version 2 services (future)
│   └── ...              # Shared services (if any)
│
└── ...
```

## API Endpoints

### Version 1 (Current)

All v1 endpoints are prefixed with `/api/v1`:

- **Upload**: `/api/v1/upload`
- **Auth**: `/api/v1/auth`
- **Users**: `/api/v1/users`

### Version 2 (Future)

All v2 endpoints will be prefixed with `/api/v2`:

- **Upload**: `/api/v2/upload` (when implemented)
- **Auth**: `/api/v2/auth` (when implemented)
- **Users**: `/api/v2/users` (when implemented)

## Adding a New Version

### Step 1: Create Version Directory

```bash
mkdir -p src/routes/v3
mkdir -p src/controllers/v3
mkdir -p src/services/v3
```

### Step 2: Create Version Index

Create `src/routes/v3/index.js`:

```javascript
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API v3 is working',
    version: '3.0.0',
  });
});

// Add your v3 routes
router.use('/upload', require('./upload'));
router.use('/auth', require('./auth'));

module.exports = router;
```

### Step 3: Register in Main Router

Update `src/routes/index.js`:

```javascript
router.use('/api/v1', require('./v1'));
router.use('/api/v2', require('./v2'));
router.use('/api/v3', require('./v3')); // Add this
```

### Step 4: Update Swagger Config

Update `src/config/swagger.js`:

```javascript
apis: [
  './src/routes/v1/**/*.js',
  './src/routes/v2/**/*.js',
  './src/routes/v3/**/*.js', // Add this
],
```

## Version Migration Strategy

### Backward Compatibility

- Old routes (`/api/v1/*`) continue to work
- New versions can coexist with old ones
- Clients can gradually migrate

### Breaking Changes

When introducing breaking changes:

1. **Create new version** (e.g., v2)
2. **Implement new endpoints** in v2
3. **Keep v1 active** for existing clients
4. **Document migration path** in API docs
5. **Deprecate v1** after migration period

### Example: Migrating Upload Endpoint

**v1** (Current):
```javascript
POST /api/v1/upload
Body: { file: <file> }
Response: { publicId, url, format, ... }
```

**v2** (New):
```javascript
POST /api/v2/upload
Body: { file: <file>, metadata: {...} }
Response: { 
  publicId, 
  url, 
  format, 
  metadata,  // New field
  thumbnailUrl  // New field
}
```

## Best Practices

### 1. Version-Specific Logic

Keep version-specific logic in versioned directories:

```javascript
// ✅ Good: Version-specific controller
src/controllers/v1/uploadController.js
src/controllers/v2/uploadController.js

// ❌ Bad: Shared controller with version checks
src/controllers/uploadController.js
if (version === 'v1') { ... }
```

### 2. Shared Utilities

Keep shared utilities in common directories:

```javascript
// ✅ Good: Shared utilities
src/utils/fileUpload.js
src/utils/validation.js
src/middleware/auth.js

// ✅ Good: Version-specific services
src/services/v1/cloudinaryService.js
src/services/v2/cloudinaryService.js
```

### 3. Consistent Naming

Use consistent naming across versions:

```javascript
// v1
src/routes/v1/upload.js
src/controllers/v1/uploadController.js

// v2
src/routes/v2/upload.js
src/controllers/v2/uploadController.js
```

### 4. Documentation

Document each version in Swagger:

```javascript
/**
 * @swagger
 * /api/v1/upload:
 *   post:
 *     summary: Upload file (v1)
 *     tags: [Upload v1]
 */
```

## Current Version Status

### Version 1 (v1) ✅
- **Status**: Active
- **Routes**: Upload, Auth, Users
- **Stability**: Stable

### Version 2 (v2) 🚧
- **Status**: Placeholder
- **Routes**: None yet
- **Stability**: Not implemented

## Migration Examples

### Example 1: Adding New Field

**v1 Response:**
```json
{
  "publicId": "uploads/abc123",
  "url": "https://...",
  "format": "jpg"
}
```

**v2 Response (with new field):**
```json
{
  "publicId": "uploads/abc123",
  "url": "https://...",
  "format": "jpg",
  "metadata": {  // New field
    "uploadedBy": "user123",
    "tags": ["profile"]
  }
}
```

### Example 2: Changing Endpoint Structure

**v1:**
```
POST /api/v1/upload
```

**v2:**
```
POST /api/v2/files/upload  // Different path structure
```

## Testing Versions

Test each version independently:

```javascript
// Test v1
describe('Upload API v1', () => {
  it('should upload file', async () => {
    const response = await request(app)
      .post('/api/v1/upload')
      .attach('file', buffer);
    expect(response.status).toBe(201);
  });
});

// Test v2
describe('Upload API v2', () => {
  it('should upload file', async () => {
    const response = await request(app)
      .post('/api/v2/upload')
      .attach('file', buffer);
    expect(response.status).toBe(201);
  });
});
```

## Version Deprecation

When deprecating a version:

1. **Announce deprecation** in API docs
2. **Set deprecation date** (e.g., 6 months)
3. **Add deprecation headers**:
   ```javascript
   res.setHeader('X-API-Deprecated', 'true');
   res.setHeader('X-API-Deprecation-Date', '2024-12-31');
   res.setHeader('X-API-Sunset-Date', '2025-06-30');
   ```
4. **Log deprecation warnings**
5. **Remove after sunset date**

## Summary

- ✅ **Organized Structure**: Clear separation by version
- ✅ **Easy Migration**: Simple to add new versions
- ✅ **Backward Compatible**: Old versions remain active
- ✅ **Scalable**: Can support multiple versions simultaneously
- ✅ **Well Documented**: Swagger docs for each version

