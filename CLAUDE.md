# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Eigent is a multi-agent workforce desktop application built with Electron that empowers users to create, manage, and deploy custom AI agents for complex workflows. The application uses CAMEL-AI's multi-agent framework for coordination and supports both cloud and local deployment models.

## Architecture

This is a multi-component system with the following main parts:

- **Frontend (Electron + React)**: Desktop application in TypeScript with Vite build system
- **Backend (FastAPI)**: Python backend API using FastAPI and CAMEL-AI framework
- **Server (Optional)**: Local backend for complete cloud separation with PostgreSQL
- **Electron**: Desktop wrapper handling main/preload processes

### Key Directories

- `src/` - React frontend source code with components, pages, hooks, and stores
- `backend/` - Python backend using FastAPI and CAMEL-AI for agent orchestration
- `server/` - Optional local server for offline deployment with Docker support
- `electron/` - Electron main and preload processes
- `test/` - Frontend test suite using Vitest and Testing Library

## Development Commands

### Frontend Development
```bash
# Install dependencies
npm install

# Start development server (requires backend running)
npm run dev

# Build application
npm run build

# Type checking
npm run type-check

# Run tests
npm run test
npm run test:watch
npm run test:coverage
```

### Backend Development (Python)
```bash
cd backend

# Install dependencies (requires Python 3.10.16)
uv install

# Run backend locally
uv run uvicorn main:api --reload --port 5678

# Run tests
uv run pytest

# Babel compilation for i18n
uv run pybabel compile -d lang
```

### Local Server Development (Optional)
```bash
cd server

# Start with Docker
cp .env.example .env
docker compose up -d

# Access API docs at http://localhost:3001/docs

# Run locally (development mode)
export database_url=postgresql://postgres:123456@localhost:5432/eigent
uv run uvicorn main:api --reload --port 3001 --host 0.0.0.0
```

## Build System Configuration

- **Frontend**: Vite with React plugin and Electron integration
- **TypeScript**: Strict mode enabled with path aliases (`@/*` → `src/*`)
- **Testing**: Vitest with jsdom environment, coverage via v8
- **Backend**: UV package manager with FastAPI and CAMEL-AI dependencies
- **Linting**: Ruff for Python backend with 120 character line length

## Key Technologies

### Frontend Stack
- React 18 with TypeScript
- Electron for desktop packaging
- Tailwind CSS + Radix UI for styling
- Zustand for state management
- React Flow for workflow visualization
- Monaco Editor for code editing
- Framer Motion for animations

### Backend Stack
- FastAPI for API framework
- CAMEL-AI for multi-agent orchestration
- UV for Python package management
- PostgreSQL for local server data persistence
- Babel for internationalization

## Environment Configuration

### Development Mode (.env.development)
```bash
# For cloud mode (default)
VITE_BASE_URL=https://api.eigent.ai

# For local mode (with local server)
VITE_BASE_URL=/api
VITE_USE_LOCAL_PROXY=true
VITE_PROXY_URL=http://localhost:3001
```

## Multi-Agent System

The application implements a multi-agent workforce using CAMEL-AI with pre-defined agent types:
- Developer Agent: Code execution and terminal commands
- Search Agent: Web browsing and content extraction
- Document Agent: Document creation and management
- Multi-Modal Agent: Image and audio processing

Agents coordinate through MCP (Model Context Protocol) tools and support both parallel execution and human-in-the-loop workflows.

## Testing Strategy

- Frontend: Vitest with React Testing Library and jsdom
- Backend: pytest with asyncio support
- Test files: `**/*.{test,spec}.?(c|m)[jt]s?(x)` pattern
- Coverage: Excludes node_modules, dist, electron, and config files

## Build Targets

- `npm run build:mac` - macOS build
- `npm run build:win` - Windows build
- `npm run build:all` - Multi-platform build
- All builds include Babel compilation and TypeScript compilation

## Local vs Cloud Deployment

The application supports two deployment modes:
1. **Cloud Mode**: Uses eigent.ai cloud services for model hosting and data storage
2. **Local Mode**: Complete local deployment with PostgreSQL backend for data privacy

For local development, the server directory provides Docker-based PostgreSQL backend with full API compatibility.