# Avada Training App - Project Documentation

## Project Overview

**Type:** Monorepo with 4 parts  
**Primary Language:** JavaScript/TypeScript (React, Preact, Node.js)  
**Architecture:** Modular Monorepo with separate frontend, backend, and extension packages

## Quick Reference

### Tech Stack

- **Frontend:** React 18, Vite 6, Shopify Polaris UI
- **Backend:** Node.js 20, Firebase Functions, Koa
- **Database:** Google Cloud Firestore
- **Script Tag:** Preact, Rspack
- **Extension:** Shopify Theme Extension (Liquid)

### Entry Points

- **Assets:** `packages/assets/src/pages/App/App.js`
- **Functions:** `packages/functions/src/index.js`
- **ScriptTag:** `packages/scripttag/src/index.js`
- **Extension:** `extensions/avada-theme-app-extension/shopify.extension.toml`

## Project Structure

```
app-name/
├── packages/
│   ├── assets/              # React/Vite frontend
│   ├── functions/           # Firebase Functions backend
│   └── scripttag/          # Preact script tag component
├── extensions/
│   └── avada-theme-app-extension/  # Shopify theme extension
├── static/                   # Build output
├── docs/                     # This documentation
└── Configuration files...
```

## Parts

### Part: assets (Frontend)

**Type:** Web Application  
**Tech Stack:** React 18, Vite 6, Shopify Polaris  
**Root:** `packages/assets/`  
**Purpose:** Main admin interface embedded in Shopify

### Part: functions (Backend)

**Type:** Backend API  
**Tech Stack:** Node.js 20, Firebase Functions, Koa  
**Root:** `packages/functions/`  
**Purpose:** Serverless API with Firestore database

### Part: scripttag (Script Tag Component)

**Type:** Web Application  
**Tech Stack:** Preact, Rspack  
**Root:** `packages/scripttag/`  
**Purpose:** Client-side component injected into storefronts

### Part: extension (Shopify Theme Extension)

**Type:** Shopify Extension  
**Tech Stack:** Liquid, Shopify Theme App Extension  
**Root:** `extensions/avada-theme-app-extension/`  
**Purpose:** Theme blocks injected into merchant themes

## Generated Documentation

### Project Documentation

- [Project Overview](project-overview.md) - High-level project description and features
- [Project Structure](project-structure.md) - Monorepo structure and parts
- [Project Parts Metadata](project-parts-metadata.json) - Part definitions in JSON

### Technical Documentation

- [Technology Stack](technology-stack.md) - Detailed technology information
- [Architecture Patterns](architecture-patterns.md) - Architecture styles and patterns
- [API Contracts - Functions](api-contracts-functions.md) - API endpoints documentation
- [Data Models - Functions](data-models-functions.md) - Firestore database schema
- [Source Tree Analysis](source-tree-analysis.md) - Complete directory structure

### Component Documentation

- [Component Inventory - Assets](component-inventory-assets.md) - UI components catalog

### Development & Operations

- [Development Guide](development-guide.md) - Setup, local development, testing
- [Deployment Guide](deployment-guide.md) - Deployment procedures and CI/CD

### Integration Documentation

- [Integration Architecture](integration-architecture.md) - Integration points between parts

### Workflow State

- [Project Scan Report](project-scan-report.json) - Workflow execution state (JSON)

### Existing Documentation

- [README](../readme.md) - Original project README
- [CODE_STRUCTURE.md](../CODE_STRUCTURE.md) - Code structure documentation
- [KNOWLEDGE_BASE.md](../KNOWLEDGE_BASE.md) - Project knowledge base
- [PROJECT_OVERVIEW.md](../PROJECT_OVERVIEW.md) - Original project overview
- [TechStack](../documents/techstack.md) - Technology stack documentation
- [CHANGELOG](../changelog.md) - Project changelog

## Getting Started

### For New Developers

1. **Prerequisites**
   - Node.js 20.x
   - Yarn 1.22.22+
   - Firebase account
   - Shopify Partner account

2. **Installation**

   ```bash
   git clone <repository-url>
   cd avada-training-app
   yarn install
   ```

3. **Configuration**
   - Set up Firebase project
   - Configure environment variables (see `packages/assets/.env.example`)
   - Create `packages/functions/.runtimeconfig.json`

4. **Start Development**
   ```bash
   yarn dev  # Full stack development
   ```

See [Development Guide](development-guide.md) for detailed setup instructions.

### For AI-Assisted Development

When using AI tools (like this one), reference these documents:

1. **Understanding the Project:**
   - Start with [Project Overview](project-overview.md)
   - Review [Technology Stack](technology-stack.md)
   - Check [Architecture Patterns](architecture-patterns.md)

2. **Working with the Backend:**
   - Use [API Contracts](api-contracts-functions.md) for endpoint details
   - Reference [Data Models](data-models-functions.md) for database schema
   - See [Integration Architecture](integration-architecture.md) for data flow

3. **Developing Frontend:**
   - Review [Component Inventory](component-inventory-assets.md) for available components
   - Follow [Source Tree Analysis](source-tree-analysis.md) for file locations

4. **Running and Deploying:**
   - Follow [Development Guide](development-guide.md) for local development
   - Use [Deployment Guide](deployment-guide.md) for deployment procedures

5. **Understanding Multi-Part Architecture:**
   - Each part has its own tech stack and entry point
   - Parts communicate via REST API and Shopify integration
   - See [Integration Architecture](integration-architecture.md) for details

## AI Development Guidance

### Working with Backend Functions

**When to Read:**

- `packages/functions/src/controllers/` - Business logic
- `packages/functions/src/repositories/` - Data access
- `packages/functions/src/routes/` - HTTP routes

**Key Patterns:**

- Controllers use Repositories for data access
- Repositories use Firestore Admin SDK
- Routes delegate to Controllers
- Middleware handles cross-cutting concerns

### Working with Frontend Assets

**When to Read:**

- `packages/assets/src/pages/` - Page components
- `packages/assets/src/components/` - Reusable components
- `packages/assets/src/hooks/` - Custom React hooks

**Key Patterns:**

- Components use hooks for data fetching
- Context API for global state (AppBridgeProvider, StoreProvider)
- Loadables for code splitting
- Services for API calls

### Working with ScriptTag

**When to Read:**

- `packages/scripttag/src/components/` - Preact components
- `packages/scripttag/src/helpers/` - Utility functions
- `packages/scripttag/src/managers/` - State managers

**Key Patterns:**

- Lightweight Preact components
- Managers for state
- Helpers for API communication

### Working with Extension

**When to Read:**

- `extensions/avada-theme-app-extension/blocks/` - Liquid templates
- `extensions/avada-theme-app-extension/snippets/` - Theme snippets
- `extensions/avada-theme-app-extension/locales/` - Translations

**Key Patterns:**

- Liquid templating for UI
- JavaScript blocks for interactivity
- Localization via JSON files

## Development Workflow

1. **Planning:** Use [Project Overview](project-overview.md) to understand requirements
2. **Implementation:** Reference [Technology Stack](technology-stack.md) and [Component Inventory](component-inventory-assets.md)
3. **Integration:** Follow [Integration Architecture](integration-architecture.md) guidelines
4. **Testing:** Use [Development Guide](development-guide.md) for local testing
5. **Deployment:** Follow [Deployment Guide](deployment-guide.md) procedures

## Documentation Metadata

**Generated:** 2026-01-31  
**Scan Level:** Deep  
**Workflow Version:** 1.2.0  
**Total Documents Generated:** 14
