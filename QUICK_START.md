# Quick Start Guide

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables
Copy `.env` file and configure:
```bash
NODE_ENV=development
PORT=3000
DATABASE_URL=mongodb://localhost:27017/your-db-name
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7

# Optional: Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_FOLDER=uploads
```

### 3. Generate Prisma Client

After setting up your environment variables, generate the Prisma Client:

```bash
npx prisma generate
```

**Note:** The application includes auto-migration functionality that will automatically sync your Prisma schema with the database on startup (enabled by default in development). To control this behavior, set `PRISMA_AUTO_MIGRATE=true` or `PRISMA_AUTO_MIGRATE=false` in your `.env` file.

### 4. Start Development Server
```bash
npm run dev
```

### 5. Start Production Server
```bash
npm start
```

## 📁 Project Structure

```
src/
├── config/          # Configuration (env, database, swagger)
├── route/            # Centralized routing
├── utilities/        # Shared utilities
├── public/           # Static files
└── v1.0/             # All v1.0 code
    ├── controller/   # Request handlers
    ├── helpers/      # v1.0 helpers
    ├── middleware/   # Express middleware
    ├── models/       # Database models
    ├── storage/      # File storage
    └── routes.js     # Route definitions
```

## 🔗 API Endpoints

### Health Check
- `GET /health` - Server health status

### API Documentation
- `GET /api-docs` - Swagger UI

### v1.0 Endpoints
- `GET /api/v1.0/` - API info
- `POST /api/v1.0/auth/register` - Register user
- `POST /api/v1.0/auth/login` - Login user
- `GET /api/v1.0/auth/me` - Get current user
- `POST /api/v1.0/uploads` - Upload file
- `GET /api/v1.0/users` - Get users (protected)

## 🧪 Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm test -- --coverage
```

## 🔧 Development

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

## 📦 Features

✅ **Production Ready**
- Security (Helmet, CORS, Rate Limiting, XSS, NoSQL injection protection)
- Error handling
- Request logging with Winston
- Request ID tracking

✅ **API Versioning**
- Clean version isolation in `v1.0/` folder
- Easy to add new versions

✅ **File Upload**
- Multer middleware
- Cloudinary integration
- Image transformation support

✅ **Authentication**
- JWT-based auth
- Role-based authorization
- Cookie support

✅ **Code Quality**
- ESLint (Airbnb config)
- Prettier
- Husky pre-commit hooks
- Jest testing

✅ **Documentation**
- Swagger/OpenAPI
- Comprehensive README

## 🎯 Best Practices

1. **Version Isolation**: All v1.0 code lives in `v1.0/` folder
2. **Shared Utilities**: Use `utilities/` for reusable code
3. **Configuration**: All config in `config/` folder
4. **Clean Architecture**: Controllers → Helpers → Models → Storage

## 📝 Notes

- All middleware, models, controllers, helpers are in `v1.0/`
- Shared utilities stay in `utilities/`
- Configuration is centralized in `config/`
- Easy to add `v2.0/` when needed

