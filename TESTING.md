# Testing Guide

This project includes comprehensive testing setup with both Karma/Jasmine and Jest configurations.

## Test Structure

### Unit Tests
- **Location**: `src/**/*.spec.ts`
- **Framework**: Jasmine + Karma
- **Coverage**: Istanbul/nyc

### Component Tests
- **PostsList**: Tests for list component functionality
- **PostForm**: Tests for form validation and submission
- **PostService**: Tests for HTTP service methods

## Running Tests

### Development
```bash
# Run tests in watch mode
npm run test:watch

# Run tests once
npm run test

# Run tests with coverage
npm run test:coverage
```

### CI/CD
```bash
# Run tests for CI (headless)
npm run test:ci

# Run linting
npm run lint

# Run security audit
npm run audit:check
```

### Jest (Alternative)
```bash
# Run Jest tests
npm run test:unit

# Run Jest with coverage
npm run test:unit:coverage

# Run Jest in watch mode
npm run test:unit:watch
```

## Test Coverage

### Coverage Thresholds
- **Statements**: 80%
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%

### Coverage Reports
- **HTML**: `coverage/index.html`
- **LCOV**: `coverage/lcov.info`
- **Text**: Console output

## Test Files

### PostService Tests (`post.service.spec.ts`)
- ✅ HTTP GET requests (getPosts, getPost)
- ✅ HTTP POST requests (createPost)
- ✅ HTTP PUT requests (updatePost)
- ✅ HTTP PATCH requests (patchPost)
- ✅ HTTP DELETE requests (deletePost)
- ✅ Error handling for all methods
- ✅ Request/response validation

### PostsList Tests (`posts-list.spec.ts`)
- ✅ Component initialization
- ✅ Data loading and error handling
- ✅ Navigation methods
- ✅ Delete confirmation dialog
- ✅ Form interactions
- ✅ Lifecycle hooks

### PostForm Tests (`post-form.spec.ts`)
- ✅ Form initialization and validation
- ✅ Edit mode detection
- ✅ Data loading for editing
- ✅ Form submission (create/update)
- ✅ Error handling
- ✅ Validation rules
- ✅ Utility methods

## Mocking

### HTTP Requests
```typescript
// Mock HTTP responses
mockPostService.getPosts.and.returnValue(of(mockPosts));
mockPostService.createPost.and.returnValue(of(createdPost));
```

### Services
```typescript
// Mock service dependencies
const mockPostService = jasmine.createSpyObj('PostService', ['getPosts', 'createPost']);
const mockRouter = jasmine.createSpyObj('Router', ['navigate']);
```

### Observables
```typescript
// Mock Observable responses
import { of, throwError } from 'rxjs';

// Success response
mockService.method.and.returnValue(of(mockData));

// Error response
mockService.method.and.returnValue(throwError(() => new Error('Test error')));
```

## Best Practices

### Test Organization
- One test file per component/service
- Descriptive test names
- Arrange-Act-Assert pattern
- Independent tests (no dependencies)

### Mocking Strategy
- Mock external dependencies
- Use jasmine.createSpyObj for services
- Mock HTTP requests with HttpClientTestingModule
- Mock router and navigation

### Assertions
- Test both success and error cases
- Verify method calls and parameters
- Check component state changes
- Validate form validation rules

## CI/CD Integration

### GitHub Actions
- **Node.js**: 18.x, 20.x
- **Steps**: Install → Lint → Test → Build
- **Coverage**: Upload to Codecov
- **Security**: npm audit

### Pre-commit Hooks
- Lint code before commit
- Run tests before commit
- Prevent commits with failing tests

## Debugging Tests

### Karma Debug
```bash
# Run tests in debug mode
ng test --watch=true --browsers=Chrome
```

### Jest Debug
```bash
# Run specific test file
npm run test:unit -- --testNamePattern="PostService"

# Run tests in debug mode
npm run test:unit -- --verbose
```

## Troubleshooting

### Common Issues
1. **Import errors**: Check module imports in test files
2. **Mock failures**: Verify spy object method names
3. **Async issues**: Use fakeAsync/tick for async operations
4. **Coverage issues**: Check test file patterns in karma.conf.js

### Solutions
1. **Update imports**: Use correct Angular testing imports
2. **Fix mocks**: Ensure spy methods match service methods
3. **Handle async**: Use proper async testing patterns
4. **Check config**: Verify test file patterns and coverage settings
