# Testing Guide

This guide covers the testing setup and best practices for the boilerplate.

## Test Environment

The boilerplate uses **Jest** as the testing framework with the following features:

- ✅ In-memory MongoDB for isolated tests
- ✅ Coverage reporting with thresholds
- ✅ Test utilities and helpers
- ✅ Global setup and teardown
- ✅ Mock support

## Test Configuration

### Jest Configuration

Located in `jest.config.js`:

- **Test Environment**: Node.js
- **Coverage Thresholds**: 70% for branches, functions, lines, and statements
- **Setup Files**: Global setup/teardown and per-test setup
- **Test Timeout**: 10 seconds

### Test Structure

```
src/__tests__/
├── setup/              # Test configuration files
├── utils/              # Test helper functions
├── models/             # Model tests
├── middleware/         # Middleware tests
├── controllers/        # Controller tests (add as needed)
└── integration/        # Integration tests (add as needed)
```

## Running Tests

### Basic Commands

```bash
# Run all tests with coverage
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration

# Run tests in CI mode (optimized for CI/CD)
npm run test:ci
```

### Watch Mode

Watch mode automatically re-runs tests when files change:

```bash
npm run test:watch
```

Press `a` to run all tests, `f` to run only failed tests, `q` to quit.

## Test Utilities

### Database Helpers

Located in `src/__tests__/utils/testHelpers.js`:

#### `connectTestDB()`
Connects to an in-memory MongoDB instance for testing.

```javascript
beforeAll(async () => {
  await connectTestDB();
});
```

#### `closeTestDB()`
Closes the database connection and stops the in-memory server.

```javascript
afterAll(async () => {
  await closeTestDB();
});
```

#### `clearDatabase()`
Clears all collections in the test database.

```javascript
afterEach(async () => {
  await clearDatabase();
});
```

### Data Helpers

#### `createTestUser(User, overrides)`
Creates a test user with default or custom data.

```javascript
const user = await createTestUser(User);
const admin = await createTestUser(User, { role: 'admin' });
```

#### `generateTestToken(userId)`
Generates a JWT token for testing authentication.

```javascript
const token = generateTestToken(user._id);
```

## Writing Tests

### Test File Structure

```javascript
const { connectTestDB, closeTestDB, clearDatabase } = require('../utils/testHelpers');
const Model = require('../../models/Model');

describe('Model Tests', () => {
  // Setup
  beforeAll(async () => {
    await connectTestDB();
  });

  // Cleanup
  afterAll(async () => {
    await closeTestDB();
  });

  // Clear data between tests
  afterEach(async () => {
    await clearDatabase();
  });

  // Tests
  describe('Feature Name', () => {
    it('should do something', async () => {
      // Test implementation
    });
  });
});
```

### Best Practices

1. **Use Descriptive Names**
   ```javascript
   // Good
   it('should return 404 when user does not exist', async () => {
     // ...
   });

   // Bad
   it('should work', async () => {
     // ...
   });
   ```

2. **Test One Thing at a Time**
   ```javascript
   // Good - separate tests
   it('should validate email format', async () => {
     // ...
   });
   it('should require email field', async () => {
     // ...
   });

   // Bad - multiple assertions in one test
   it('should validate user', async () => {
     // email validation
     // password validation
     // name validation
   });
   ```

3. **Use Test Helpers**
   ```javascript
   // Good
   const user = await createTestUser(User);

   // Bad
   const user = await User.create({
     name: 'Test User',
     email: 'test@example.com',
     password: 'password123',
   });
   ```

4. **Clean Up After Tests**
   ```javascript
   afterEach(async () => {
     await clearDatabase();
   });
   ```

5. **Test Both Success and Error Cases**
   ```javascript
   describe('User Creation', () => {
     it('should create user with valid data', async () => {
       // Success case
     });

     it('should fail with invalid email', async () => {
       // Error case
     });
   });
   ```

## Test Examples

### Model Tests

```javascript
const User = require('../../models/User');
const { connectTestDB, closeTestDB, createTestUser } = require('../utils/testHelpers');

describe('User Model', () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  it('should create a user', async () => {
    const user = await createTestUser(User);
    expect(user._id).toBeDefined();
    expect(user.email).toBe('test@example.com');
  });
});
```

### API Tests

```javascript
const request = require('supertest');
const app = require('../../server');

describe('API Endpoints', () => {
  it('should return health status', async () => {
    const response = await request(app).get('/health');
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
```

### Controller Tests

```javascript
const User = require('../../models/User');
const { getUsers } = require('../../controllers/userController');
const { connectTestDB, closeTestDB, createTestUser } = require('../utils/testHelpers');

describe('User Controller', () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  it('should get all users', async () => {
    await createTestUser(User);
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });
});
```

## Coverage

### Viewing Coverage

After running tests, coverage reports are generated in:
- **HTML**: `coverage/lcov-report/index.html`
- **LCOV**: `coverage/lcov.info`
- **JSON**: `coverage/coverage-final.json`

### Coverage Thresholds

The project enforces minimum coverage:
- Branches: 70%
- Functions: 70%
- Lines: 70%
- Statements: 70%

If coverage falls below these thresholds, tests will fail.

### Improving Coverage

1. Write tests for all code paths
2. Test error cases
3. Test edge cases
4. Use coverage reports to identify untested code

## Debugging Tests

### Running a Single Test

```bash
npm test -- --testNamePattern="should create user"
```

### Running Tests in a Specific File

```bash
npm test -- User.test.js
```

### Debug Mode

```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

Then open Chrome and go to `chrome://inspect`.

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:ci
```

## Troubleshooting

### Tests Failing with Database Errors

- Ensure `mongodb-memory-server` is installed
- Check that `connectTestDB()` is called in `beforeAll`
- Verify `closeTestDB()` is called in `afterAll`

### Coverage Not Generating

- Ensure tests are actually running
- Check `collectCoverageFrom` in `jest.config.js`
- Verify files aren't in `coveragePathIgnorePatterns`

### Slow Tests

- Use `clearDatabase()` instead of dropping/recreating
- Avoid unnecessary database operations
- Use mocks for external services

