# Contributing Guide

Thank you for your interest in contributing! This guide will help you get started.

## Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nodejs-mongodb-express-boilerplate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Install Husky hooks** (if not already installed)
   ```bash
   npm run prepare
   ```

## Code Style

### ESLint

We use ESLint with Airbnb's base configuration. Run the linter:

```bash
npm run lint
```

Fix auto-fixable issues:

```bash
npm run lint:fix
```

### Prettier

We use Prettier for code formatting. Format your code:

```bash
npm run format
```

Check formatting:

```bash
npm run format:check
```

### Pre-commit Hooks

Husky automatically runs linting and formatting on staged files before commits. This ensures code quality.

## Testing

### Writing Tests

1. Place test files in `src/__tests__/` following the existing structure
2. Use descriptive test names
3. Test both success and error cases
4. Use test helpers from `src/__tests__/utils/testHelpers.js`

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Coverage

Maintain at least 70% code coverage. Tests will fail if coverage drops below this threshold.

## Commit Messages

Follow conventional commit format:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Example:
```
feat: add user authentication endpoint
fix: resolve MongoDB connection timeout issue
docs: update API documentation
```

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Write/update tests
4. Ensure all tests pass
5. Ensure linting passes
6. Update documentation if needed
7. Submit a pull request

### PR Checklist

- [ ] Tests pass (`npm test`)
- [ ] Linting passes (`npm run lint`)
- [ ] Code is formatted (`npm run format:check`)
- [ ] Documentation updated (if needed)
- [ ] Coverage maintained (70%+)

## Code Review

All code must be reviewed before merging. Reviewers will check:

- Code quality and style
- Test coverage
- Documentation
- Security considerations
- Performance implications

## Questions?

Feel free to open an issue for questions or discussions.

