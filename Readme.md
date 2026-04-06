# Frontend Template

Frontend template with React and Hexagonal Architecture following XP practices.

## Features

- **React 19** with TypeScript
- **Vite 6** for fast development and building
- **Hexagonal Architecture** with clear separation of concerns
- **TDD** with Jest and Testing Library
- **E2E Testing** with Playwright
- **CSS Modules** for styling

## Project Structure

```
src/
├── main.tsx                          # Entry point
├── shared/
│   ├── domain/
│   │   ├── DomainError.ts
│   │   ├── Maybe.ts
│   │   └── value-objects/
│   │       └── Id.ts
│   ├── infrastructure/
│   │   ├── http/
│   │   │   ├── HttpClient.ts
│   │   │   └── endpoints.ts          # Backend API endpoints
│   │   ├── ui/
│   │   │   ├── App.tsx
│   │   │   ├── globals.css
│   │   │   └── routes.ts             # Frontend routes
│   │   └── factory.ts
│   └── tests/
│       ├── TestFactory.ts            # Test dependencies
│       └── unit/
├── health/
│   ├── domain/
│   │   ├── entities/
│   │   │   └── Health.ts
│   │   └── repositories/
│   │       └── HealthRepository.ts   # Interface + InMemory
│   ├── application/
│   │   ├── HealthUseCase.ts
│   │   └── HealthDTO.ts
│   ├── infrastructure/
│   │   ├── adapters/
│   │   │   └── HttpHealthRepository.ts
│   │   └── ui/
│   │       ├── Health.tsx
│   │       ├── Health.hook.ts
│   │       └── Health.module.css
│   └── tests/
│       ├── unit/
│       ├── integration/
│       └── e2e/
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Installation

```bash
npm install
```

### Development

```bash
# Start development server
npm start
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `/api` |

### Testing

```bash
# Run all unit tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests (requires backend)
npm run test:integration

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Building

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Code Quality

```bash
# Run linter
npm run lint

# Fix lint issues
npm run lint:fix

# Type check
npm run compile

# Full validation
npm run validate
```

## Architecture

This project follows **Hexagonal Architecture** (Ports & Adapters):

### Layers

1. **Domain** - Business logic, entities, value objects
2. **Application** - Use cases, DTOs
3. **Infrastructure** - Adapters HTTP, UI

### Dependency Rule

```
Infrastructure → Application → Domain
```

Dependencies always point inward. Domain has no external dependencies.

### Testing Strategy

- **Unit Tests**: Domain entities, value objects, use cases, hooks
- **Integration Tests**: HTTP adapters against real API
- **E2E Tests**: Full UI flows with Playwright

## Connecting to Backend

This frontend is designed to work with the `backend-template`:

1. Start the backend on port 8080
2. Run `npm start`

## Cursor IDE

This project includes Cursor commands and rules for AI-assisted development following XP practices.

### Commands

Located in `.cursor/commands/`:

| Command | Description |
|---------|-------------|
| `/validate` | Run full validation (compile + lint + test) and fix errors |
| `/tdd` | Start TDD cycle for a new feature |
| `/tests` | Generate tests for existing code |
| `/refactor` | Refactor code following design rules |
| `/refactor-tests` | Refactor tests to follow testing standards |
| `/rename` | Rename symbols across the codebase |
| `/tpp` | Apply Transformation Priority Premise |
| `/ux-review` | Review UI/UX and suggest improvements |

### Rules

Located in `.cursor/rules/`:

**XP Practices:**
- `agent-xp.mdc` - XP agent behavior (navigator + driver)
- `practices-tdd.mdc` - TDD cycle and TPP
- `practices-testing.mdc` - Testing standards (no mocks)
- `practices-inside-out.mdc` - Inside-out development flow

**Architecture:**
- `architecture--hexagonal.mdc` - Hexagonal architecture overview
- `architecture-domain-*.mdc` - Domain layer rules
- `architecture-application-*.mdc` - Application layer rules
- `architecture-infrastructure-*.mdc` - Infrastructure layer rules

**Design:**
- `design-naming.mdc` - Naming conventions
- `design-functions.mdc` - Function standards
- `design-classes-modules.mdc` - Class and module standards
- `design-comments.mdc` - Comments and formatting
- `design-errors.mdc` - Error handling

**Frontend:**
- `frontend-components.mdc` - React component rules
- `frontend-hooks.mdc` - React hooks rules
- `frontend-css-modules.mdc` - CSS Modules styling

## License

MIT
