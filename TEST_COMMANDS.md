# Test Commands Guide

## 🧪 Available Test Commands

### Basic Test Commands

```bash
# Run all tests with coverage
npm test

# Run tests in watch mode (auto-rerun on file changes)
npm run test:watch

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration

# Run tests in CI mode (optimized for CI/CD)
npm run test:ci
```

## 📊 Detailed Command Explanations

### 1. `npm test`
**Full Command**: `NODE_ENV=test jest --coverage`

**What it does**:
- Runs all test files in `__tests__` directory
- Generates coverage report
- Shows coverage summary in terminal
- Creates coverage folder with HTML reports

**Output**:
- Test results
- Coverage summary (branches, functions, lines, statements)
- Coverage threshold validation (70% minimum)

**Example**:
```bash
npm test
```

### 2. `npm run test:watch`
**Full Command**: `NODE_ENV=test jest --watch`

**What it does**:
- Runs tests in watch mode
- Automatically reruns tests when files change
- Interactive mode with options:
  - `a` - Run all tests
  - `f` - Run only failed tests
  - `q` - Quit watch mode
  - `p` - Filter by filename pattern
  - `t` - Filter by test name pattern

**Use case**: Development - see test results instantly as you code

**Example**:
```bash
npm run test:watch
```

### 3. `npm run test:unit`
**Full Command**: `NODE_ENV=test jest --testPathPattern=__tests__ --coverage`

**What it does**:
- Runs only unit tests (tests in `__tests__` folder)
- Excludes integration tests
- Generates coverage report

**Use case**: Quick unit test validation

**Example**:
```bash
npm run test:unit
```

### 4. `npm run test:integration`
**Full Command**: `NODE_ENV=test jest --testPathPattern=integration --coverage`

**What it does**:
- Runs only integration tests
- Tests that require full application setup
- Generates coverage report

**Use case**: Test API endpoints and full workflows

**Example**:
```bash
npm run test:integration
```

### 5. `npm run test:ci`
**Full Command**: `NODE_ENV=test jest --coverage --ci --maxWorkers=2`

**What it does**:
- Runs tests optimized for CI/CD environments
- Limits workers to 2 (prevents resource exhaustion)
- Non-interactive mode
- Fails on coverage threshold violations

**Use case**: Continuous Integration pipelines

**Example**:
```bash
npm run test:ci
```

## 🎯 Advanced Test Commands

### Run Specific Test File

```bash
# Run a specific test file
npx jest src/__tests__/health.test.js

# Run with coverage
npx jest src/__tests__/health.test.js --coverage
```

### Run Tests Matching Pattern

```bash
# Run tests matching "auth" in filename
npx jest --testNamePattern="auth"

# Run tests matching "User" in test name
npx jest --testNamePattern="User"

# Run tests in specific directory
npx jest src/__tests__/models/
```

### Run Tests with Verbose Output

```bash
# Show detailed test output
npx jest --verbose

# Show coverage for each file
npx jest --coverage --verbose
```

### Run Tests in Parallel/Serial

```bash
# Run tests serially (one at a time)
npx jest --runInBand

# Run with specific number of workers
npx jest --maxWorkers=4
```

### Update Snapshots

```bash
# Update snapshot files
npx jest --updateSnapshot

# Or short form
npx jest -u
```

### Clear Cache

```bash
# Clear Jest cache
npx jest --clearCache
```

## 📁 Test File Structure

```
src/__tests__/
├── api.test.js              # API endpoint tests
├── health.test.js            # Health check tests
├── middleware/
│   └── errorHandler.test.js # Error handler tests
├── models/
│   └── User.test.js         # User model tests
├── setup/
│   ├── jest.setup.js        # Runs before each test
│   ├── global.setup.js       # Runs once before all tests
│   └── global.teardown.js   # Runs once after all tests
└── utils/
    ├── response.test.js     # Response utility tests
    └── testHelpers.js       # Test helper functions
```

## 🛠️ Test Helpers

### Available Test Utilities

Located in `src/__tests__/utils/testHelpers.js`:

```javascript
const {
  connectTestDB,      // Connect to in-memory MongoDB
  closeTestDB,        // Close test database
  clearDatabase,       // Clear all collections
  createTestUser,     // Create test user
  generateTestToken,  // Generate JWT token for testing
} = require('../utils/testHelpers');
```

### Example Test Usage

```javascript
const { connectTestDB, closeTestDB, createTestUser } = require('../utils/testHelpers');
const User = require('../../v1.0/models/User');

describe('User Tests', () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  it('should create a user', async () => {
    const user = await createTestUser(User, {
      email: 'test@example.com',
      name: 'Test User',
    });
    expect(user.email).toBe('test@example.com');
  });
});
```

## 📊 Coverage Reports

### View Coverage

After running `npm test`, coverage reports are generated in:

- **Terminal**: Summary in console
- **HTML Report**: `coverage/lcov-report/index.html`
- **LCOV Report**: `coverage/lcov.info` (for CI tools)
- **JSON Summary**: `coverage/coverage-summary.json`

### Open HTML Coverage Report

```bash
# On macOS
open coverage/lcov-report/index.html

# On Linux
xdg-open coverage/lcov-report/index.html

# On Windows
start coverage/lcov-report/index.html
```

## ✅ Coverage Thresholds

The boilerplate requires minimum 70% coverage for:
- Branches
- Functions
- Lines
- Statements

If coverage falls below 70%, tests will fail.

## 🔍 Debugging Tests

### Run Single Test with Debug

```bash
# Run with Node debugger
node --inspect-brk node_modules/.bin/jest --runInBand

# Or use VS Code debugger
# Add breakpoints and use "Jest: Debug" configuration
```

### Verbose Output for Debugging

```bash
# Show all console.log output
npx jest --verbose --no-coverage

# Show test names as they run
npx jest --listTests
```

## 🚀 Quick Test Workflow

### Development Workflow

```bash
# 1. Start watch mode
npm run test:watch

# 2. Make changes to code
# Tests automatically rerun

# 3. Check coverage
npm test
```

### Pre-Commit Workflow

```bash
# Tests run automatically via Husky pre-commit hook
git commit -m "Your message"
# Tests run, linting runs, then commit proceeds
```

### CI/CD Workflow

```bash
# In CI pipeline
npm run test:ci
# Fails if coverage below threshold
```

## 📝 Writing Tests

### Test File Naming

- Unit tests: `*.test.js` or in `__tests__/` folder
- Integration tests: `*.integration.test.js` or in `integration/` folder

### Test Structure

```javascript
describe('Feature Name', () => {
  beforeAll(() => {
    // Setup before all tests
  });

  beforeEach(() => {
    // Setup before each test
  });

  afterEach(() => {
    // Cleanup after each test
  });

  afterAll(() => {
    // Cleanup after all tests
  });

  it('should do something', () => {
    // Test implementation
    expect(result).toBe(expected);
  });
});
```

## 🎯 Common Test Scenarios

### Testing API Endpoints

```javascript
const request = require('supertest');
const app = require('../app');

describe('GET /health', () => {
  it('should return 200', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
  });
});
```

### Testing Models

```javascript
const User = require('../../v1.0/models/User');

describe('User Model', () => {
  it('should create user with valid data', async () => {
    const user = await User.create({
      name: 'Test',
      email: 'test@example.com',
      password: 'password123',
    });
    expect(user._id).toBeDefined();
  });
});
```

### Testing Middleware

```javascript
const errorHandler = require('../../v1.0/middleware/errorHandler');

describe('Error Handler', () => {
  it('should handle errors', () => {
    const err = new Error('Test error');
    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
```

## 🐛 Troubleshooting

### Tests Not Running

```bash
# Clear Jest cache
npx jest --clearCache

# Reinstall dependencies
rm -rf node_modules && npm install
```

### Coverage Not Generating

```bash
# Ensure coverage is enabled
npx jest --coverage

# Check coverage directory permissions
ls -la coverage/
```

### Database Connection Issues in Tests

```bash
# Tests use in-memory MongoDB
# If issues occur, check testHelpers.js
# Ensure mongodb-memory-server is installed
npm install --save-dev mongodb-memory-server
```

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [MongoDB Memory Server](https://github.com/nodkz/mongodb-memory-server)

