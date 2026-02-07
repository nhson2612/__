# Technology Stack

## Overview

This monorepo project uses a modern technology stack optimized for Shopify app development, with separate stacks for frontend, backend, and extension components.

## Part: assets (Frontend)

| Category                | Technology                 | Version | Purpose                                 |
| ----------------------- | -------------------------- | ------- | --------------------------------------- |
| **Framework**           | React                      | 18.2.0  | UI rendering and component architecture |
| **Build Tool**          | Vite                       | 6.0.3   | Fast build and development server       |
| **UI Library**          | Shopify Polaris            | 13.9.1  | Shopify design system and components    |
| **Shopify Integration** | App Bridge                 | 3.7.10  | Embedded app communication              |
|                         | App Bridge React           | 4.1.5   | React bindings for App Bridge           |
|                         | App Bridge Utils           | 3.5.1   | Utility functions for App Bridge        |
| **Routing**             | React Router DOM           | 5.3.3   | Client-side routing                     |
|                         | React Router               | 7.9.2   | Core routing library                    |
|                         | React Router Routes Loader | 0.2.1   | Route configuration                     |
| **HTTP Client**         | Axios                      | 0.27.2  | API calls                               |
| **Database**            | Firebase                   | 9.10.0  | Firebase SDK integration                |
| **Utilities**           | qs-stringify               | 1.2.1   | Query string handling                   |
|                         | Moment.js                  | 2.29.1  | Date/time manipulation                  |
| **Markdown**            | React Markdown             | 8.0.3   | Markdown rendering                      |
|                         | Remark GFM                 | 3.0.1   | GitHub Flavored Markdown                |
|                         | Rehype Raw                 | 6.1.1   | HTML in markdown                        |
| **Colors**              | React Color                | 2.19.3  | Color picker                            |
| **Development**         | Babel                      | 7.22.10 | JavaScript transpiler                   |
|                         | ESLint                     | 6.8.0   | Code linting                            |
|                         | Prettier                   | 1.18.2  | Code formatting                         |
| **Styling**             | Sass                       | 1.59.2  | CSS preprocessor                        |
| **Vite Plugins**        | @vitejs/plugin-react       | 4.2.1   | React plugin for Vite                   |
|                         | vite-plugin-environment    | 1.1.3   | Environment variables                   |
|                         | vite-plugin-node-polyfills | 0.21.0  | Node.js polyfills for browser           |

### Architecture Pattern

**Component-based Architecture** - React components with hooks for state management and side effects.

### Entry Points

- `index.html` - Main HTML template
- `embed-template.html` - Embedded app template
- `standalone.html` - Standalone app template

---

## Part: functions (Backend)

| Category        | Technology             | Version | Purpose                   |
| --------------- | ---------------------- | ------- | ------------------------- |
| **Runtime**     | Node.js                | 20      | JavaScript runtime        |
| **Serverless**  | Firebase Functions     | 4.4.1   | Cloud functions platform  |
| **Firebase**    | Firebase Admin         | 11.10.0 | Firebase SDK (admin)      |
| **Database**    | Google Cloud Firestore | 6.6.1   | NoSQL database            |
| **Messaging**   | Google Cloud PubSub    | 3.7.1   | Event messaging           |
| **Server**      | Koa                    | 2.16.2  | Web framework             |
|                 | Koa Router             | 14.0.0  | Routing middleware        |
|                 | Koa EJS                | 4.2.0   | Template rendering        |
|                 | @koa/cors              | 5.0.0   | CORS middleware           |
| **Shopify**     | shopify-api-node       | 3.11.0  | Shopify API client        |
| **HTTP Client** | Axios                  | 1.12.2  | HTTP requests             |
|                 | Node-fetch             | 2.6.7   | HTTP requests (legacy)    |
|                 | Isomorphic-fetch       | 2.2.1   | Universal fetch           |
| **Validation**  | Yup                    | 1.7.1   | Schema validation         |
| **GraphQL**     | graphql-tag            | 2.12.6  | GraphQL template literals |
| **Utilities**   | Moment.js              | 2.29.1  | Date/time manipulation    |
|                 | qs                     | 6.11.0  | Query string parsing      |
| **Avada SDKs**  | @avada/core            | 4.6.0   | Avada core utilities      |
|                 | @avada/firestore-utils | 0.0.3   | Firestore helpers         |
|                 | @avada/utils           | 2.0.3   | Avada utilities           |

### Architecture Pattern

**Serverless Microservices** - Firebase Functions with Koa for HTTP handling.

### Entry Points

- `src/index.js` - Main functions entry point

---

## Part: scripttag (Script Tag Component)

| Category        | Technology            | Version | Purpose                       |
| --------------- | --------------------- | ------- | ----------------------------- |
| **Framework**   | Preact                | 10.3.2  | Lightweight React alternative |
| **State**       | Preact Context        | 1.1.4   | Context API for Preact        |
| **Build Tool**  | Rspack                | 1.2.8   | Fast bundler (Rust-based)     |
| **Transpiler**  | Babel                 | 7.x     | JavaScript transpiler         |
| **Styling**     | Sass                  | 1.71.0  | CSS preprocessor              |
|                 | Sass-embedded         | 1.85.1  | Embedded Sass compiler        |
| **Utilities**   | Preact HTML Converter | 0.4.2   | HTML to Preact conversion     |
| **Development** | Cross-env             | 7.0.3   | Cross-platform environment    |
|                 | Dotenv                | 16.0.3  | Environment variables         |

### Architecture Pattern

**Lightweight Component-based** - Preact for minimal bundle size.

### Entry Points

- `src/index.js` - Main script entry point

---

## Part: extension (Shopify Theme Extension)

| Category       | Technology                                   | Version | Purpose                   |
| -------------- | -------------------------------------------- | ------- | ------------------------- |
| **Platform**   | Shopify App Extension                        | -       | Theme extension platform  |
| **Templating** | Liquid                                       | -       | Shopify template language |
| **UID**        | 4c1fc221-0936-55bc-feaf-3cc2d60dd745651079e4 | -       | Extension identifier      |

### Architecture Pattern

**Shopify Theme Extension** - Blocks and snippets injected into themes.

### Entry Points

- `shopify.extension.toml` - Extension configuration

---

## Root Workspace Configuration

| Tool                   | Version         | Purpose |
| ---------------------- | --------------- | ------- | ------------------------------ |
| **Package Manager**    | Yarn            | 1.22.22 | Dependency management          |
| **Workspaces**         | Yarn Workspaces | -       | Monorepo management            |
| **Shopify CLI**        | @shopify/cli    | 3.85.5  | Shopify app development        |
| **Development**        | ESLint          | 6.3.0   | Code linting (root)            |
|                        | Prettier        | 1.18.2  | Code formatting                |
| **Testing**            | Jest            | 24.9.0  | Testing framework              |
|                        | Babel Jest      | 24.9.0  | Babel for Jest                 |
| **Firebase Tools**     | firebase-tools  | 12.9.1  | Firebase deployment/management |
| **Process Management** | Concurrently    | 7.6.0   | Run multiple processes         |
| **Console**            | @avada/console  | 1.0.0   | Avada console utilities        |

---

## Development Tools

| Tool               | Usage                                  |
| ------------------ | -------------------------------------- |
| Git Hooks          | Pre-commit hooks for linting           |
| Firebase Emulators | Local Firebase development             |
| Shopify App CLI    | Shopify app development and deployment |

---

## Key Technology Decisions

| Decision                 | Justification                            |
| ------------------------ | ---------------------------------------- |
| **Preact for ScriptTag** | Minimal bundle size for injected scripts |
| **Vite for Assets**      | Fast HMR and optimized production builds |
| **Firebase Functions**   | Serverless, auto-scaling backend         |
| **Shopify App Bridge**   | Required for embedded Shopify apps       |
| **Firestore**            | NoSQL database with real-time sync       |
| **Rspack**               | Extremely fast bundling for production   |
| **Polaris UI**           | Consistent Shopify design experience     |
