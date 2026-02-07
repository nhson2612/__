# Development Guide

## Prerequisites

### Required Software

- **Node.js**: 20.x (for Firebase Functions)
- **Yarn**: 1.22.22 or higher (for monorepo workspaces)
- **Firebase CLI**: 13.15.2 or higher
- **Shopify CLI**: 3.85.5 or higher
- **Git**: Latest version

### Required Accounts

- **Firebase Account**: Create project and enable services
- **Shopify Partner Account**: Create app and get API credentials
- **Service Account Key**: For Firebase admin SDK access

---

## Installation

### 1. Clone Repository

```bash
git clone <repository-url>
cd avada-training-app
```

### 2. Install Dependencies

```bash
yarn install
```

This will install dependencies for all workspace packages:

- `packages/assets`
- `packages/functions`
- `packages/scripttag`

### 3. Configure Firebase Project

```bash
firebase use --add
```

Select your Firebase project from the list.

### 4. Create Environment Configuration

**For Assets (Frontend):**

Create `packages/assets/.env.development`:

```bash
VITE_SHOPIFY_API_KEY=<Your Shopify API Key>
VITE_FIREBASE_API_KEY=<Your Firebase API Key>
VITE_FIREBASE_AUTH_DOMAIN=<Your Firebase Auth Domain>
VITE_FIREBASE_PROJECT_ID=<Your Firebase Project ID>
VITE_FIREBASE_STORAGE_BUCKET=<Your Storage Bucket>
VITE_FIREBASE_APP_ID=<Your Firebase App ID>
VITE_FIREBASE_MEASUREMENT_ID=<Your Analytics ID>
```

**For Functions (Backend):**

Create `packages/functions/.runtimeconfig.json`:

```json
{
  "shopify": {
    "api_key": "<Shopify API Key>",
    "secret": "<Shopify Secret>",
    "firebase_api_key": "<Firebase API Key>"
  },
  "app": {
    "base_url": "<Local Development URL>"
  }
}
```

### 5. Initialize Firestore

Create empty Firestore database and deploy indexes:

```bash
firebase deploy --only firestore
```

### 6. Setup Git Hooks (Optional)

```bash
cp git-hooks/pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

---

## Local Development

### Development Mode Selection

The app supports two development modes:

#### 1. Embedded App Development (Recommended)

```bash
yarn dev
```

Or using environment variables:

```bash
IS_EMBEDDED_APP=yes yarn workspace @avada/assets run watch
```

**What it does:**

- Starts Vite dev server for embedded mode
- Builds frontend with embedded templates
- Proxies API calls to Firebase Functions (via Vite proxy)
- Runs Shopify app in embedded mode

**Vite Dev Server:**

- Host: `localhost` or configured `HOST`
- Port: `3000` (default, configurable via `FRONTEND_PORT`)
- HMR: WebSocket support for hot reload

#### 2. Standalone App Development

```bash
IS_EMBEDDED_APP=no yarn workspace @avada/assets run watch
```

**What it does:**

- Builds standalone version without Shopify context
- Uses `standalone.html` template
- Useful for testing without Shopify admin

#### 3. Full Stack Development

**Start Frontend + Backend Together:**

```bash
yarn start-dev
```

This runs:

- Assets watcher (Vite)
- Functions watcher (Babel)
- Concurrently manages both processes

**For Script Tag Development:**

```bash
yarn start-dev-embed
```

This runs:

- Functions watcher
- Script tag watcher (Rspack)

### Firebase Emulators (Local Backend)

```bash
GOOGLE_APPLICATION_CREDENTIALS=<path-to-service-account.json> firebase emulators:start --only hosting,functions,pubsub
```

**Emulator Ports:**

- Hosting: `5002`
- Functions: `5001`
- Firestore: `8080`
- PubSub: `8085`

**Access Emulated Functions:**

- Frontend auto-configures to use emulator URLs
- Set environment: `NODE_ENV=development`

---

## Build Process

### Development Build

```bash
# Assets (Frontend)
yarn workspace @avada/assets run development

# Functions (Backend)
yarn workspace @avada/functions run development

# Script Tag
yarn workspace @avada/scripttag run build:dev
```

### Production Build

```bash
# All packages
yarn predeploy

# Individual packages
yarn workspace @avada/assets run production
yarn workspace @avada/functions run production
yarn workspace @avada/scripttag run build
```

**Build Outputs:**

| Package   | Output Directory    | Files                               |
| --------- | ------------------- | ----------------------------------- |
| assets    | `static/`           | `embed.js`, `standalone.js`, assets |
| functions | `functions/lib/`    | Transpiled JavaScript               |
| scripttag | `static/scripttag/` | `avada-sale-pop.min.js`             |

---

## Testing

### Linting

**Run ESLint on all packages:**

```bash
yarn eslint-fix
```

**Individual packages:**

```bash
yarn workspace @avada/assets run eslint-fix
yarn workspace @avada/functions run eslint-fix
yarn workspace @avada/scripttag run eslint-fix
```

### Running Tests

Currently, the project uses Jest for testing. Tests should be located in:

- `**/*.test.js`
- `**/*.spec.js`

```bash
yarn test
```

**Note:** Test coverage and test files are marked as TODO in the project README.

---

## Shopify Development

### Start Shopify App Dev Server

```bash
shopify app dev
```

This will:

- Start local development server
- Create/ngrok tunnel for HTTPS
- Open Shopify app in development store
- Handle OAuth flow automatically

### Shopify App URL Update

```bash
shopify app update-url --app-url https://localhost:3000/auth/shopify/callback
```

### Create Extension

```bash
shopify app generate extension
```

### Deploy to Shopify

```bash
shopify app deploy
```

---

## Deployment

### Production Deployment (CI/CD)

The project uses GitLab CI/CD for automated deployments.

**Trigger Conditions:**

- Tag on branch: `update/s-cli-new-auth`
- Commit title NOT containing `[deploy-only]`

**Deployment Process:**

1. Install dependencies with Yarn cache
2. Build all packages (`yarn predeploy`)
3. Set production environment variables
4. Deploy to Firebase Hosting and Functions

### Manual Deployment

**Deploy Everything:**

```bash
firebase deploy
```

**Deploy Specific Services:**

```bash
firebase deploy --only hosting
firebase deploy --only functions
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

### Pre-deploy Script

```bash
yarn predeploy
```

This runs:

- `yarn workspace @avada/assets run production`
- `yarn workspace @avada/functions run production`

### Production Environment Variables

Set these in GitLab CI/CD Variables:

| Variable                       | Purpose                   |
| ------------------------------ | ------------------------- |
| `PROD_SHOPIFY_API_KEY`         | Shopify API key           |
| `PROD_FIREBASE_API_KEY`        | Firebase API key          |
| `PROD_FIREBASE_AUTH_DOMAIN`    | Firebase auth domain      |
| `PROD_FIREBASE_PROJECT_ID`     | Firebase project ID       |
| `PROD_FIREBASE_STORAGE_BUCKET` | Storage bucket            |
| `PROD_FIREBASE_APP_ID`         | Firebase app ID           |
| `PROD_FIREBASE_MEASUREMENT_ID` | Analytics ID              |
| `FIREBASE_DEPLOY_KEY`          | Firebase deployment token |

---

## Common Development Tasks

### Update App URL After Network Change

```bash
yarn update-localhost-runtime
```

This updates the base URL in runtime configuration.

### Fix Content Security Policy (Embedded Mode)

**Problem:** Chrome blocks embedded app with CSP error.

**Solution:** Install Chrome extension [Disable Content-Security-Policy](https://chrome.google.com/webstore/detail/disable-content-security/ieelmcmcagommplceebfedjlakkhpden)

### View Function Logs

```bash
firebase functions:log
```

Or view in Firebase Console under Functions → Logs.

### Reset Local Development

```bash
yarn dev-reset
```

This resets the Shopify app development environment.

---

## Troubleshooting

### "Unauthorized" After Authentication

1. Generate new private key: Firebase Console → Settings → Service Accounts → Generate New Private Key
2. Set environment variable: `export GOOGLE_APPLICATION_CREDENTIALS=<path-to-key.json>`

### "PERMISSION_DENIED" Firestore Error

Enable "Service Account Token Creator" permission for the service account at:

```
https://console.cloud.google.com/iam-admin/iam/project/<project-id>
```

### Missing FIREBASE_MEASUREMENT_ID

Enable Google Analytics for your Firebase project to generate this ID.

### Yarn Workspace Issues

If dependencies are not linked correctly:

```bash
yarn install --force
rm -rf node_modules
yarn install
```

### Firebase Emulators Port Conflicts

Kill processes on ports before starting:

```bash
npx kill-port 8085 5001 8080 5002
```

---

## Development Workflow

1. **Setup**: Run `yarn install` and configure environment files
2. **Develop**: Run `yarn dev` or `yarn start-dev`
3. **Test**: Use Firebase emulators for local backend testing
4. **Lint**: Run `yarn eslint-fix` before committing
5. **Deploy**: Create tag to trigger CI/CD or run `firebase deploy`

---

## Project Scripts Reference

| Command                    | Description                           |
| -------------------------- | ------------------------------------- |
| `yarn dev`                 | Start Shopify app in development      |
| `yarn start-dev`           | Start frontend + backend dev together |
| `yarn start-dev-embed`     | Start script tag + backend dev        |
| `yarn predeploy`           | Build all packages for production     |
| `yarn eslint-fix`          | Fix ESLint issues across all packages |
| `yarn logs`                | View Firebase function logs           |
| `firebase emulators:start` | Start Firebase emulators locally      |
| `shopify app dev`          | Start Shopify CLI dev server          |
| `shopify app deploy`       | Deploy app to Shopify                 |
