# File Upload Feature Documentation

This boilerplate includes a complete file upload system with Cloudinary integration, supporting single and multiple file uploads.

## Features

- ✅ **Single File Upload** - Upload one file at a time
- ✅ **Multiple File Upload** - Upload up to 10 files simultaneously
- ✅ **Cloudinary Integration** - Third-party cloud storage
- ✅ **Image Transformation** - On-the-fly image resizing and optimization
- ✅ **File Validation** - Type and size validation
- ✅ **Secure Uploads** - Protected routes with JWT authentication
- ✅ **File Deletion** - Delete single or multiple files
- ✅ **Memory Storage** - Efficient buffer-based uploads

## Setup

### 1. Install Dependencies

Dependencies are already included in `package.json`:
- `multer` - File upload middleware
- `cloudinary` - Cloud storage service
- `sharp` - Image processing (optional, for future enhancements)

### 2. Configure Cloudinary

1. Sign up for a free account at [Cloudinary](https://cloudinary.com)
2. Get your credentials from the dashboard:
   - Cloud Name
   - API Key
   - API Secret

3. Update your `.env` file:

```env
# File Upload Configuration
MAX_FILE_SIZE=5242880  # 5MB in bytes
ALLOWED_FILE_TYPES=image/jpeg,image/jpg,image/png,image/gif,image/webp

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_FOLDER=uploads  # Optional: folder name in Cloudinary
```

## API Endpoints

### Upload Single File

```http
POST /api/v1/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body:
- file: <file>
- folder: <optional folder name>
- publicId: <optional custom public ID>
```

**Response:**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "publicId": "uploads/abc123",
    "url": "https://res.cloudinary.com/.../image/upload/v123/...",
    "format": "jpg",
    "width": 1920,
    "height": 1080,
    "bytes": 245678,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### Upload Multiple Files

```http
POST /api/v1/upload/multiple
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body:
- files: <file1>, <file2>, <file3>
- folder: <optional folder name>
- publicId: <optional base public ID>
```

**Response:**
```json
{
  "success": true,
  "message": "Files uploaded successfully",
  "data": {
    "files": [
      {
        "publicId": "uploads/abc123_0",
        "url": "https://...",
        "format": "jpg",
        "width": 1920,
        "height": 1080,
        "bytes": 245678,
        "createdAt": "2024-01-01T00:00:00Z"
      },
      {
        "publicId": "uploads/abc123_1",
        "url": "https://...",
        "format": "png",
        "width": 800,
        "height": 600,
        "bytes": 123456,
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "count": 2
  }
}
```

### Delete Single File

```http
DELETE /api/v1/upload/:publicId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "File deleted successfully",
  "data": {
    "result": "ok"
  }
}
```

### Delete Multiple Files

```http
DELETE /api/v1/upload/multiple
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "publicIds": ["uploads/abc123", "uploads/def456"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Files deleted successfully",
  "data": {
    "deleted": {
      "uploads/abc123": "deleted",
      "uploads/def456": "deleted"
    }
  }
}
```

### Get Transformed Image URL

```http
GET /api/v1/upload/transform/:publicId?width=800&height=600&crop=limit&quality=auto&format=webp
```

**Response:**
```json
{
  "success": true,
  "message": "Transformed URL generated",
  "data": {
    "url": "https://res.cloudinary.com/.../w_800,h_600,c_limit,q_auto,f_webp/...",
    "publicId": "uploads/abc123"
  }
}
```

## Usage Examples

### Using cURL

#### Upload Single File
```bash
curl -X POST http://localhost:3000/api/v1/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/image.jpg" \
  -F "folder=products"
```

#### Upload Multiple Files
```bash
curl -X POST http://localhost:3000/api/v1/upload/multiple \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "files=@/path/to/image1.jpg" \
  -F "files=@/path/to/image2.png" \
  -F "folder=products"
```

#### Delete File
```bash
curl -X DELETE http://localhost:3000/api/v1/upload/uploads/abc123 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using JavaScript (Fetch API)

```javascript
// Upload single file
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('folder', 'products');

const response = await fetch('http://localhost:3000/api/v1/upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});

const data = await response.json();
console.log(data.data.url); // File URL
```

```javascript
// Upload multiple files
const formData = new FormData();
Array.from(fileInput.files).forEach(file => {
  formData.append('files', file);
});
formData.append('folder', 'products');

const response = await fetch('http://localhost:3000/api/v1/upload/multiple', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});

const data = await response.json();
console.log(data.data.files); // Array of uploaded files
```

### Using Axios

```javascript
import axios from 'axios';

// Upload single file
const uploadFile = async (file, folder = 'uploads') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  const response = await axios.post(
    'http://localhost:3000/api/v1/upload',
    formData,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data.data;
};

// Upload multiple files
const uploadMultipleFiles = async (files, folder = 'uploads') => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('files', file);
  });
  formData.append('folder', folder);

  const response = await axios.post(
    'http://localhost:3000/api/v1/upload/multiple',
    formData,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data.data.files;
};
```

## Configuration

### File Size Limit

Default: 5MB (5242880 bytes)

Change in `.env`:
```env
MAX_FILE_SIZE=10485760  # 10MB
```

### Allowed File Types

Default: `image/jpeg, image/jpg, image/png, image/gif, image/webp`

Change in `.env`:
```env
ALLOWED_FILE_TYPES=image/jpeg,image/jpg,image/png,image/gif,image/webp,application/pdf
```

### Cloudinary Folder

Default: `uploads`

Change in `.env`:
```env
CLOUDINARY_FOLDER=my-app/uploads
```

## Image Transformation

Cloudinary supports on-the-fly image transformations. Use the transform endpoint:

```
GET /api/v1/upload/transform/:publicId?width=800&height=600&crop=limit&quality=auto&format=webp
```

### Transformation Parameters

- `width` - Image width in pixels
- `height` - Image height in pixels
- `crop` - Cropping mode: `limit`, `fill`, `fit`, `scale`, `thumb`
- `quality` - Image quality: `auto`, `best`, `good`, `eco`, `low`
- `format` - Output format: `jpg`, `png`, `webp`, `gif`

### Example Transformations

```javascript
// Resize to 800x600 with limit crop
const url = `http://localhost:3000/api/v1/upload/transform/${publicId}?width=800&height=600&crop=limit`;

// Convert to WebP with auto quality
const url = `http://localhost:3000/api/v1/upload/transform/${publicId}?format=webp&quality=auto`;

// Thumbnail 200x200
const url = `http://localhost:3000/api/v1/upload/transform/${publicId}?width=200&height=200&crop=thumb`;
```

## Error Handling

### Common Errors

**400 Bad Request:**
- No file provided
- Invalid file type
- File too large
- Too many files

**401 Unauthorized:**
- Missing or invalid JWT token

**500 Internal Server Error:**
- Cloudinary upload failure
- Network issues

### Error Response Format

```json
{
  "success": false,
  "message": "Error message",
  "errors": {
    "stack": "Error stack trace (development only)"
  }
}
```

## Security

1. **Authentication Required** - All upload endpoints require JWT authentication
2. **File Type Validation** - Only allowed file types are accepted
3. **File Size Limits** - Prevents large file uploads
4. **Secure Storage** - Files stored in Cloudinary with secure URLs
5. **Input Validation** - All inputs are validated before processing

## Best Practices

1. **Validate on Client Side** - Check file type and size before upload
2. **Use Folders** - Organize files using folder parameters
3. **Store Public IDs** - Save Cloudinary public IDs in your database
4. **Clean Up** - Delete unused files to save storage
5. **Use Transformations** - Serve optimized images using transformation URLs
6. **Error Handling** - Always handle upload errors gracefully

## Integration with Models

Example: Adding file uploads to a User model

```javascript
// src/models/User.js
const userSchema = new mongoose.Schema({
  // ... existing fields
  avatar: {
    publicId: String,
    url: String,
  },
  photos: [{
    publicId: String,
    url: String,
  }],
});
```

## Testing

Test file uploads using the provided test utilities or Postman:

1. Get authentication token
2. Use token in Authorization header
3. Upload file using multipart/form-data
4. Verify response contains file URL

## Troubleshooting

### Cloudinary Configuration Error
- Verify all Cloudinary credentials in `.env`
- Check Cloudinary dashboard for correct values

### File Upload Fails
- Check file size (must be under MAX_FILE_SIZE)
- Verify file type is in ALLOWED_FILE_TYPES
- Ensure JWT token is valid

### Files Not Appearing in Cloudinary
- Check Cloudinary dashboard
- Verify folder name is correct
- Check Cloudinary account limits

## Additional Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Multer Documentation](https://github.com/expressjs/multer)
- [Swagger API Docs](http://localhost:3000/api-docs)

