# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a TypeScript-based Cypress API testing project for ServeREST, a REST API used for testing purposes. The project uses Cypress for API testing with full TypeScript support and strict type checking.

## Essential Commands

### Running ServeREST Server
```bash
npm start  # Starts ServeREST on http://localhost:3000 (required before running tests)
```

### Running Tests
```bash
npm run cy:open       # Interactive mode - opens Cypress Test Runner
npm run cy:run        # Headless mode - runs all tests in terminal
```

### Development Commands
```bash
npm run type-check    # TypeScript type checking (no emit)
npm run lint          # Run ESLint and auto-fix issues
npm run format        # Format code with Prettier
npm run clean         # Remove cypress/results directory
```

### Running Single Test
To run a single test file interactively, use `npm run cy:open` and select the test. For headless:
```bash
npx cypress run --spec "cypress/e2e/usuarios.cy.ts"
```

## Architecture

### Test Structure
- **Test Files**: `cypress/e2e/*.cy.ts` - Main test suites (usuarios, produtos, carrinho, login)
- **Shared Utilities**: `cypress/e2e/shared/*.ts` - Reusable helper functions for creating test data
- **Custom Commands**: `cypress/support/commands/*.ts` - Cypress custom commands (e.g., login)
- **Type Definitions**: `cypress/support/types/*.d.ts` - TypeScript interfaces and types

### Key Architectural Patterns

#### Authentication Flow
Tests requiring authentication use the custom `cy.login()` command, which:
- Accepts `{ admin: true }` or `{ normal: true }` parameter
- Creates a new user via `createUserAdm()` or `createUser()`
- Performs login and stores the token in `window.localStorage`
- Token is automatically included in subsequent requests by `apiRequest()`

#### API Request Wrapper
The `apiRequest()` function (`cypress/e2e/shared/apiRequest.ts`) is the central wrapper for all API calls:
- Automatically adds standard headers (`accept`, `content-type`)
- Retrieves auth token from localStorage when `auth: true` (default)
- Uses `cy.api()` from `cypress-plugin-api` for better API testing support
- Accepts optional `failOnStatusCode` parameter for negative testing

#### Test Data Generation
Shared utility functions in `cypress/e2e/shared/`:
- `createUser()` / `createUserAdm()` - Create users with Faker.js data
- `createUserId()` - Create user and return only the ID
- `createProduct()` / `createProductId()` - Create products
- `generateProductData()` - Generate random product data
- `createTrolley()` - Create shopping cart

All data creation uses `@faker-js/faker` for realistic test data.

#### Type Safety
All API requests and responses are strictly typed:
- Request options: `ApiRequestOptions`
- Request bodies: `UserData`, `ProductData`, `CartData`
- Response bodies: `LoginResponse`, `SuccessMessageResponse`, `ErrorResponse`, `UserResponse`, `ProductResponse`

This prevents runtime errors and provides IDE autocomplete.

## Configuration

### Cypress Config (`cypress.config.ts`)
- Base URL: `http://localhost:3000` (ServeREST server)
- Spec pattern: `./cypress/e2e/**/*.cy.ts`
- Retry strategy: `detect-flake-but-always-fail` with max 2 retries in run mode
- Videos disabled, screenshots saved to `./cypress/results/screenshots`

### TypeScript Config
- Strict mode enabled with all strict checks
- Path alias: `@/*` maps to `./cypress/*` (though not heavily used)
- ES2020 target with ESNext modules
- Cypress types included globally

### ESLint Rules
- Import ordering enforced: groups separated by newlines, alphabetically sorted
- Prettier integration for code formatting
- Cypress-specific rules: no async tests, no pausing, no unnecessary waiting
- Unused vars allowed if prefixed with underscore

## CI/CD

GitHub Actions workflow (`.github/workflows/main.yml`) runs on push/PR to main:
1. Type check (`npm run type-check`)
2. Lint (`npm run lint`)
3. Run all tests in Chrome (`cypress run`)
4. Upload screenshots on failure

## Development Notes

### When Writing New Tests
1. Import types from `cypress/support/types/api` for type safety
2. Use `apiRequest()` instead of raw `cy.request()` for consistency
3. Use `beforeEach()` with `cy.login({ admin: true })` if tests need authentication
4. Cast response bodies to appropriate types (e.g., `response.body as LoginResponse`)
5. Set `failOnStatusCode: false` when testing error scenarios

### When Adding Shared Utilities
- Place in `cypress/e2e/shared/` directory
- Export as default function
- Add JSDoc comments for usage examples
- Return `Cypress.Chainable` types for proper chaining

### Authentication Token
- Stored in `window.localStorage.getItem('token')`
- Automatically included in `Authorization` header by `apiRequest()` when `auth: true`
- Created via `cy.login()` command which handles user creation and login

### ServeREST API Endpoints
Tests cover these main endpoints:
- `/login` - Authentication
- `/usuarios` - User CRUD operations
- `/produtos` - Product CRUD operations
- `/carrinhos` - Shopping cart operations
