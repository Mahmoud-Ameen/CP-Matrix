# Backend Architecture Documentation

## Overview

The backend follows a layered architecture pattern with clear separation of concerns. It's built using Node.js, Express.js, and MongoDB, focusing on maintainability, scalability, and type safety using TypeScript.

## Architecture Layers

### 1. API Layer (Controllers)

-   Handles HTTP requests and responses
-   Implements input validation and sanitization
-   Uses standardized response format

```typescript
interface ApiResponse<T> {
	success: boolean
	data?: T
	error?: {
		code: string
		message: string
		details?: any
	}
	meta?: {
		page?: number
		limit?: number
		total?: number
	}
}
```

### 2. Service Layer

-   Implements business logic
-   Coordinates between multiple repositories
-   Handles data transformation and validation
-   Manages external API interactions (e.g., Codeforces API)

### 3. Repository Layer

-   Handles database operations
-   Implements data access patterns
-   Manages database transactions
-   Provides data persistence abstractions

### 4. Data Layer

-   MongoDB database
-   Mongoose schemas and models
-   Data validation rules

## Key Components

### Controllers

-   `problem.controller.ts`: Handles problem-related endpoints
-   `userProblemStatus.controller.ts`: Manages user problem statuses
-   `user.controller.ts`: Handles user authentication and management

### Services

-   `problem.service.ts`: Problem-related business logic
-   `userProblemStatus.service.ts`: User problem status synchronization
-   `cfAccountInfo.service.ts`: Codeforces API integration

### Repositories

-   `problem.repository.ts`: Problem data access
-   `userProblemStatus.repository.ts`: User problem status data access
-   `user.repository.ts`: User data management

## Data Flow

1. **Request Flow**

```
HTTP Request → Controller → Service → Repository → Database
                ↑            ↑          ↑
                Validation   Business    Data Access
                            Logic       Logic
```

2. **Response Flow**

```
Database → Repository → Service → Controller → HTTP Response
           ↓           ↓          ↓
           Data        Data       Response
           Mapping     Processing Formatting
```

## Error Handling

### Error Types

-   `VALIDATION_ERROR`: Input validation failures
-   `AUTH_ERROR`: Authentication/authorization issues
-   `NOT_FOUND`: Resource not found
-   `RATE_LIMIT`: Rate limiting violations
-   `INTERNAL_ERROR`: Unexpected server errors

### Error Response Format

```typescript
{
    success: false,
    error: {
        code: string;
        message: string;
        details?: any;
    }
}
```

## External Integrations

### Codeforces API

-   Problem data synchronization
-   User submission tracking
-   Contest information retrieval

## Security

### Authentication

-   Firebase authentication integration
-   JWT token validation
-   Role-based access control

### Data Validation

-   Input sanitization using Zod
-   Request parameter validation
-   Type safety with TypeScript

## Configuration Management

### Environment Variables

-   Database connection strings
-   API keys and secrets
-   Service configurations

### Constants

-   Rate limiting parameters
-   Pagination defaults

## Development Practices

### Code Organization

```
src/
├── controllers/     # Request handlers
├── services/       # Business logic
├── repositories/   # Data access
├── models/         # Database schemas
├── types/          # TypeScript types
├── utils/          # Helper functions
├── middleware/     # Express middleware
└── config/         # Configuration
```

## Design Decisions

### 1. Controller-Service-Repository Pattern

We chose this pattern for several key reasons:

-   **Separation of Concerns**: Each layer has a specific responsibility
    -   Controllers handle HTTP concerns
    -   Services manage business logic
    -   Repositories abstract data access
-   **Testability**: Each layer can be tested in isolation
-   **Maintainability**: Changes in one layer don't necessarily affect others
-   **Code Organization**: Clear structure makes it easier for new developers to understand the codebase

### 2. Functional Approach with TypeScript Objects

We deliberately chose not to use classes and instead leverage TypeScript objects and functions:

```typescript
// Instead of classes:
class ProblemService {
    constructor(private problemRepository: ProblemRepository) {}
    async getProblems() { ... }
}

// We use object literals and functions:
interface IProblemService {
    getProblems: (filters: IProblemFilters) => Promise<Problem[]>;
}

const problemService: IProblemService = {
    getProblems: async (filters) => {
        // implementation
    }
};
```

Benefits of this approach:

-   **Simplicity**: No need for `this` binding or class inheritance complexities

### 3. Dependency Inversion and Interfaces

We use TypeScript interfaces extensively to define contracts between layers:

```typescript
// Define interface for repository
interface IProblemRepository {
	findById(id: string): Promise<IProblem>
	findMany(filters: IProblemFilters): Promise<IProblem[]>
}

// Implement for MongoDB
const problemRepository: IProblemRepository = {
	findById: async (id) => {
		return Problem.findOne({ problemId: id })
	},
	findMany: async (filters) => {
		return Problem.find(generateQueryFromFilters(filters))
	},
}
```

This approach:

-   **Database Agnosticism**: Makes it easier to switch databases or add new ones
-   **Testing**: Allows easy mocking of dependencies
-   **Clear Contracts**: Interfaces serve as documentation and type checking

### Coding Standards

-   TypeScript for type safety
-   ESLint for code quality
-   Prettier for code formatting
-   JSDoc for documentation

## Future Considerations

### Scalability

-   Caching layer implementation
-   Rate limiting refinement
-   Database indexing optimization

### Monitoring

-   APM integration
-   Error tracking service
-   Performance monitoring

### Features

-   Enhanced problem recommendations
-   User analytics
-   Contest tracking
