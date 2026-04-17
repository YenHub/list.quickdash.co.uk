# QuickList Project Context

## Project Overview

QuickList is a simple list and task management Progressive Web App (PWA) designed for desktop and mobile. The app features a dark mode by default, stores notes locally, and supports offline functionality. It's designed to be a lightweight task manager that complements more complex project management tools like Trello, Jira, and Monday.

**Current Status:** Actively developed with many planned features including collaboration, sharing, and enhanced UI customization.

## Architecture

### Tech Stack

**Frontend:**

- React 17.0.1 with TypeScript
- Material UI (MUI) v5 for UI components
- Zustand v4 for state management
- Axios for HTTP requests
- localForage for client-side storage
- Socket.io-client for real-time features
- React Markdown for rich text support

**Backend:**

- Express.js 4.17.1 with TypeScript
- Sequelize ORM for database operations
- MySQL 8+ database
- Winston for logging
- Socket.io for real-time communication

**Infrastructure:**

- Docker Compose for containerization
- pnpm workspaces for monorepo management
- Firebase Hosting for deployment
- GitHub Actions for CI/CD

### Project Structure

```
list.quickdash.co.uk/
├── client/              # React frontend application
│   ├── src/            # Source code
│   ├── public/         # Static assets
│   └── build/          # Production build output
├── server/             # Express backend API
│   ├── bin/            # Entry point (www)
│   ├── controllers/    # Request handlers
│   ├── models/         # Sequelize models
│   ├── routes/         # API routes
│   ├── utils/          # Utility functions
│   └── views/          # Pug templates
├── docker-compose.yml  # Container orchestration
├── firebase.json       # Firebase hosting config
├── .firebaserc         # Firebase project config
└── package.json        # Root package.json with scripts
```

## Building and Running

### Prerequisites

- Docker and Docker Compose (recommended)
- pnpm package manager
- Node.js (for standalone development)

### Quick Start (Docker)

```bash
# Clone the repository
git clone git@github.com:YenHub/list.quickdash.co.uk.git
cd list.quickdash.co.uk

# Create environment files
cp .env.example .env
cp server/.env.example server/.env

# Start all services
docker-compose up

# Access the application
# Frontend: http://localhost
# API: http://localhost:9000
# phpMyAdmin: http://localhost:8080
```

### Development Commands

**From root directory:**

```bash
# Start all services (Docker)
docker-compose up

# Start in detached mode
docker-compose up -d

# Stop services
docker-compose down

# Build containers
docker-compose build

# Run frontend standalone (Docker)
docker-compose up client-app

# Run backend standalone (Docker)
docker-compose up server-app

# Run frontend standalone (npm)
cd client
pnpm install
pnpm start

# Run backend standalone (npm)
cd server
pnpm install
pnpm dev
```

**Package scripts (from root):**

```bash
# Frontend
pnpm app:start          # Start frontend dev server
pnpm app:build          # Build frontend for production
pnpm app:test           # Run frontend tests
pnpm app:lint           # Lint frontend code
pnpm app:lint:fix       # Auto-fix frontend linting issues
pnpm app:prettier       # Format frontend code

# Backend
pnpm server:start       # Start backend server
pnpm server:dev         # Start backend in development mode
pnpm server:build:dev   # Build backend for development
pnpm server:build:production  # Build backend for production
pnpm server:serve:dev   # Serve backend in dev mode
pnpm server:lint        # Lint backend code
pnpm server:lint:fix    # Auto-fix backend linting issues
pnpm server:prettier    # Format backend code
pnpm server:debug       # Debug backend server
```

### Environment Configuration

Create `.env` file in root and `server/.env` with the following variables:

```env
# Database configuration
DB_PORT=3306
DB_DATABASE=quicklist
DB_PASSWORD=NodeMySQL2020
DB_SERVICE_USER=NodeUser
DB_SERVICE_USER_PASSWORD=Node@User_Pass2021
DB_HOST=node-mysql
DB_TEST=testDB
```

**Default Ports:**

- Frontend: 80 (Docker) / 3000 (npm)
- API: 9000
- MySQL: 3389 (mapped from 3306)
- phpMyAdmin: 8080

## Development Conventions

### Code Style

**Frontend (TypeScript/React):**

- ESLint with TypeScript rules
- Prettier for code formatting
- Single quotes for strings
- No semicolons (TypeScript)
- 2-space indentation
- Strict TypeScript typing

**Backend (TypeScript/Express):**

- ESLint with TypeScript rules
- Prettier for code formatting
- Single quotes for strings
- Semicolons required
- 2-space indentation
- Strict TypeScript typing

### Testing

**Frontend:**

- Jest with React Testing Library
- Tests located in `client/src/__tests__/`
- Run with: `pnpm app:test`
- Tests verify component rendering, user interactions, and state management

**Backend:**

- Unit tests for API endpoints
- Test database configuration required
- Run with: `pnpm server:test` (when available)

### State Management

The project uses a custom hooks/context/reducer implementation for state management (see `client/src/Services/State/Store.tsx`). This replaces Redux and provides a lightweight, type-safe state management solution.

### Database

- MySQL database with Sequelize ORM
- Database migrations handled by Sequelize
- Database volumes stored in `./docker_volumes/var/lib/mysql`
- phpMyAdmin available at http://localhost:8080 for database management

### Deployment

**CI/CD Pipeline:**

- GitHub Actions workflow for automated deployment
- Triggered on push to master
- Steps: Build → Test → Lint → Deploy to Firebase

**Firebase Deployment:**

```bash
# Login to Firebase
firebase login

# Add hosting target
firebase target:apply hosting list-quickdash list-quickdash

# Deploy to Firebase
firebase deploy --only hosting:list-quickdash
```

**Build Process:**

1. Frontend: `pnpm i --frozen-lockfile` → `pnpm --filter client build`
2. Backend: `pnpm --filter server build:production`
3. Deploy to Firebase Hosting

### Code Quality

**Linting:**

- Frontend: ESLint with TypeScript and React plugins
- Backend: ESLint with TypeScript and Express plugins
- Run linting before committing changes

**Formatting:**

- Prettier for consistent code formatting
- Auto-fix available for both frontend and backend

### Git Workflow

- Main branch: `master`
- Feature branches: `feature/feature-name`
- Staging branch: `staging`
- Commit messages should be concise and descriptive

## Key Files Reference

- `docker-compose.yml` - Container orchestration and service definitions
- `firebase.json` - Firebase hosting configuration and security headers
- `.firebaserc` - Firebase project and target configuration
- `package.json` - Root package.json with workspace scripts
- `client/package.json` - Frontend dependencies and scripts
- `server/package.json` - Backend dependencies and scripts
- `.eslintrc` - Root ESLint configuration
- `client/.eslintrc.js` - Frontend ESLint configuration (TypeScript/React)
- `server/.eslintrc.json` - Backend ESLint configuration (TypeScript/Express)

## Known Issues and Limitations

- MySQL user permissions may need adjustment on first run
- Localhost HTTPS redirects can be annoying (clear HSTS via chrome://net-internals#hsts)
- Docker volumes for MySQL are in `.gitignore`
- Some features are still in development (collaboration, sharing, authentication)

## Future Development

Planned features include:

- Server-side list sharing via URL
- Real-time collaboration on lists
- HTML embedding of lists
- Custom UI color schemes
- List item color schemes
- List item dates (expiration, due dates with countdown)
- JWT authentication
- User management with roles and permissions
