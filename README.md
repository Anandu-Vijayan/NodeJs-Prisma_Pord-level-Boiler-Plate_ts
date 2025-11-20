# Node.js MongoDB Express Boilerplate

A production-ready Node.js boilerplate with Express.js and MongoDB, featuring security best practices, error handling, logging, and Docker support.

## Features

- ✅ **Express.js** - Fast, unopinionated web framework
- ✅ **Prisma** - Modern database toolkit with type-safe queries
- ✅ **MongoDB** - Database with Prisma ORM
- ✅ **Auto-Migration** - Automatic schema synchronization on startup
- ✅ **Security** - Helmet, CORS, rate limiting, XSS protection, NoSQL injection protection
- ✅ **Error Handling** - Centralized error handling middleware
- ✅ **Logging** - Winston logger with file and console transports
- ✅ **Environment Configuration** - Environment variable validation
- ✅ **Code Quality** - ESLint (Airbnb config) and Prettier configuration
- ✅ **Testing** - Jest with comprehensive test setup, coverage thresholds, and in-memory MongoDB
- ✅ **Pre-commit Hooks** - Husky and lint-staged for code quality enforcement
- ✅ **Docker Support** - Dockerfile and docker-compose.yml
- ✅ **Async/Await** - Async handler wrapper for cleaner code
- ✅ **Validation** - Express-validator ready
- ✅ **JWT Ready** - JWT configuration included
- ✅ **Compression** - Response compression
- ✅ **Health Check** - Built-in health check endpoint
- ✅ **Test Utilities** - Helper functions for testing (in-memory DB, test data creation)

## Project Structure

```
.
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.ts  # Prisma database connection
│   │   ├── migration.ts # Auto-migration utility
│   │   └── env.ts       # Environment variables
│   ├── controllers/     # Route controllers
│   │   └── userController.ts
│   ├── middleware/      # Custom middleware
│   │   ├── errorHandler.ts
│   │   ├── notFound.ts
│   │   └── security.ts
│   ├── models/          # Prisma models (schema in prisma/schema.prisma)
│   │   └── User.ts
│   ├── routes/          # Express routes
│   │   ├── api.js
│   │   └── index.js
│   ├── utils/           # Utility functions
│   │   ├── asyncHandler.js
│   │   ├── logger.js
│   │   └── response.js
│   └── server.js        # Application entry point
├── logs/                # Log files (created automatically)
├── .env.example         # Environment variables template
├── .gitignore
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- MongoDB (local or remote)

### Installation

1. **Clone or navigate to the project directory**

```bash
cd "Boiler Plates"
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env
```

Edit `.env` and update the following:
- `DATABASE_URL` - Your MongoDB connection string (e.g., `mongodb://localhost:27017/your-database-name`)
- `JWT_SECRET` - A strong secret key for JWT tokens
- `PRISMA_AUTO_MIGRATE` - Set to `true` to enable auto-migration, `false` to disable (default: enabled in development)
- Other configuration as needed

4. **Generate Prisma Client**

```bash
npx prisma generate
```

5. **Create logs directory**

```bash
mkdir logs
```

6. **Start the development server**

```bash
npm run dev
```

The application will automatically sync your Prisma schema with the database on startup if auto-migration is enabled (default in development mode).

The server will start on `http://localhost:3000`

## Available Scripts

### Development
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Testing
- `npm test` - Run all tests with coverage
- `npm run test:watch` - Run tests in watch mode
- `npm run test:unit` - Run unit tests only
- `npm run test:integration` - Run integration tests only
- `npm run test:ci` - Run tests in CI mode

### Code Quality
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## API Endpoints

### Health Check
- `GET /health` - Server health check

### API Base
- `GET /api/v1/` - API information

## Docker Usage

### Using Docker Compose (Recommended)

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Using Docker Only

```bash
# Build image
docker build -t nodejs-app .

# Run container
docker run -p 3000:3000 --env-file .env nodejs-app
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/production/test) | development |
| `PORT` | Server port | 3000 |
| `MONGODB_URI` | MongoDB connection string | - |
| `JWT_SECRET` | JWT secret key | - |
| `JWT_EXPIRE` | JWT expiration time | 7d |
| `JWT_COOKIE_EXPIRE` | JWT cookie expiration (days) | 7 |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window (minutes) | 15 |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 100 |
| `CORS_ORIGIN` | CORS allowed origins | * |
| `LOG_LEVEL` | Logging level | info |

## Security Features

- **Helmet** - Sets various HTTP headers for security
- **CORS** - Cross-Origin Resource Sharing configuration
- **Rate Limiting** - Prevents brute force attacks
- **XSS Protection** - Sanitizes user input
- **NoSQL Injection Protection** - Sanitizes MongoDB queries
- **Password Hashing** - Bcrypt for password security
- **JWT** - JSON Web Token support

## Error Handling

The boilerplate includes centralized error handling:

- Automatic error logging
- Consistent error response format
- Mongoose error handling
- JWT error handling
- Validation error handling

## Logging

Logs are written to:
- Console (development: colored, production: JSON)
- `logs/combined.log` - All logs
- `logs/error.log` - Error logs only
- `logs/exceptions.log` - Uncaught exceptions
- `logs/rejections.log` - Unhandled promise rejections

## Testing

The boilerplate includes a comprehensive testing setup with Jest:

### Test Structure

```
src/__tests__/
├── setup/
│   ├── jest.setup.js        # Runs before each test file
│   ├── global.setup.js      # Runs once before all tests
│   └── global.teardown.js   # Runs once after all tests
├── utils/
│   └── testHelpers.js       # Test utility functions
├── api.test.js              # API endpoint tests
├── health.test.js           # Health check tests
├── models/
│   └── User.test.js         # Model tests
└── middleware/
    └── errorHandler.test.js # Middleware tests
```

### Running Tests

```bash
# Run all tests with coverage
npm test

# Run tests in watch mode
npm run test:watch

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration
```

### Test Utilities

The boilerplate includes test helpers for:
- In-memory MongoDB setup (using `mongodb-memory-server`)
- Database cleanup between tests
- Test user creation
- JWT token generation

Example usage:

```javascript
const { connectTestDB, closeTestDB, createTestUser } = require('../utils/testHelpers');
const User = require('../../models/User');

describe('User Tests', () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  it('should create a user', async () => {
    const user = await createTestUser(User);
    expect(user._id).toBeDefined();
  });
});
```

### Coverage Thresholds

The project enforces minimum coverage thresholds:
- Branches: 70%
- Functions: 70%
- Lines: 70%
- Statements: 70%

## Code Quality

### ESLint

The project uses ESLint with Airbnb's base configuration plus additional plugins:
- `eslint-config-airbnb-base` - Industry-standard rules
- `eslint-plugin-jest` - Jest-specific rules
- `eslint-plugin-security` - Security-focused rules
- `eslint-plugin-import` - Import/export rules

### Pre-commit Hooks

Husky and lint-staged automatically:
- Run ESLint on staged files
- Format code with Prettier
- Prevent commits with linting errors

### Prettier

Code formatting is enforced with Prettier. Configuration in `.prettierrc`.

## Adding New Features

### Adding a New Route

1. Create controller in `src/controllers/`
2. Create route file in `src/routes/`
3. Import and use in `src/routes/api.js`
4. Write tests in `src/__tests__/`

Example:

```javascript
// src/routes/api.js
router.use('/users', require('./users'));

// src/routes/users.js
const express = require('express');
const router = express.Router();
const { getUsers } = require('../controllers/userController');

router.get('/', getUsers);

module.exports = router;
```

### Adding a New Model

1. Create a new file in `src/models/` following the User model pattern
2. Write tests in `src/__tests__/models/`

### Writing Tests

Follow these best practices:
- Use descriptive test names
- Test both success and error cases
- Use test helpers for common operations
- Keep tests isolated and independent
- Clean up after tests

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET`
3. Configure proper `CORS_ORIGIN`
4. Set up MongoDB connection string
5. Use process manager (PM2, systemd, etc.)
6. Set up reverse proxy (Nginx, etc.)
7. Enable HTTPS
8. Set up monitoring and logging

## License

MIT

## Contributing

Feel free to submit issues and enhancement requests!

