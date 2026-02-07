# Deployment Guide

## Overview

The Avada Training App uses Firebase Hosting and Functions for deployment, with GitLab CI/CD for automated builds.

---

## Infrastructure

### Hosting

**Provider:** Firebase Hosting

**Domain:** Configured via Firebase console

**Public Directory:** `static/`

**Deployment Flow:**

```
1. Build assets → static/
2. Deploy to Firebase Hosting
3. Configure rewrites for API → Functions
```

**Firebase Hosting Configuration** (`firebase.json`):

```json
{
  "hosting": {
    "public": "static",
    "rewrites": [
      {"source": "/api/**", "function": "api"},
      {"source": "/auth/**", "function": "auth"},
      {"source": "/webhook/**", "function": "webhook"},
      {"source": "/embed/**", "function": "embedApp"},
      {"source": "**", "destination": "/standalone.html"}
    ],
    "headers": [
      {
        "source": "embed.html",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "no-cache, no-store, must-revalidate"
          }
        ]
      }
    ]
  }
}
```

### Functions

**Provider:** Firebase Cloud Functions

**Runtime:** Node.js 20

**Region:** Configured in Firebase console

**Function Types:**

| Function    | Trigger | Purpose                 |
| ----------- | ------- | ----------------------- |
| `api`       | HTTP    | Main API endpoint       |
| `apiSa`     | HTTP    | Standalone API          |
| `auth`      | HTTP    | Authentication          |
| `authSa`    | HTTP    | Standalone auth         |
| `embedApp`  | HTTP    | Embedded app handler    |
| `webhook`   | HTTP    | Shopify webhook handler |
| `apiClient` | HTTP    | Client API handler      |

**Function Configuration** (`firebase.json`):

```json
{
  "functions": {
    "source": "packages/functions",
    "predeploy": "npm --prefix \"$RESOURCE_DIR\" run production",
    "ignore": ["src/", "test/", "node_modules/"]
  }
}
```

### Database

**Provider:** Google Cloud Firestore

**Indexes:** Deployed via `firestore.indexes.json`

**Security Rules:** Defined in `firestore.rules`

**Collections:**

- `shops`
- `notifications`
- `subscriptions`
- `settings`
- `appNews`
- `samples`

### Storage

**Provider:** Firebase Storage

**Bucket:** Configured via environment variables

**Usage:** Storing app assets, uploads

---

## CI/CD Pipeline

### GitLab CI/CD Configuration

**File:** `.gitlab-ci.yml`

**Docker Image:** `registry.gitlab.com/anhnt34/avada-docker-image-cicd:latest`

**Stages:**

1. `deploy` - Production deployment

**Cache Strategy:**

- `.yarn-cache/` - Yarn package cache
- `packages/*/.yarn-cache/` - Workspace caches

### Deployment Trigger Conditions

**Required:**

- Branch: `update/s-cli-new-auth`
- Tag: New version tag

**Excluded:**

- Commits with `[deploy-only]` in title

### Deployment Steps

1. **Install Dependencies:**

   ```bash
   yarn install
   ```

2. **Set Environment Variables:**

   ```bash
   echo VITE_SHOPIFY_API_KEY=$PROD_SHOPIFY_API_KEY >> packages/assets/.env.production
   echo VITE_FIREBASE_API_KEY=$PROD_FIREBASE_API_KEY >> packages/assets/.env.production
   # ... other variables
   ```

3. **Build All Packages:**

   ```bash
   yarn predeploy
   ```

4. **Deploy to Firebase:**

   ```bash
   firebase deploy -m "Pipeline $CI_PIPELINE_ID, build $CI_BUILD_ID" --non-interactive --token $FIREBASE_DEPLOY_KEY --force
   ```

5. **Artifacts:**
   - `static/` directory preserved as artifact

### Required CI/CD Variables

| Variable                       | Purpose                              |
| ------------------------------ | ------------------------------------ |
| `PROD_SHOPIFY_API_KEY`         | Shopify API key for production       |
| `PROD_FIREBASE_API_KEY`        | Firebase API key                     |
| `PROD_FIREBASE_AUTH_DOMAIN`    | Firebase auth domain                 |
| `PROD_FIREBASE_PROJECT_ID`     | Firebase project ID                  |
| `PROD_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket              |
| `PROD_FIREBASE_APP_ID`         | Firebase app ID                      |
| `PROD_FIREBASE_MEASUREMENT_ID` | Firebase analytics ID                |
| `FIREBASE_DEPLOY_KEY`          | Firebase deployment token            |
| `GITLAB_USER_NAME`             | GitLab user name for deploy metadata |

---

## Manual Deployment

### Prerequisites

- Firebase CLI installed and authenticated
- Service account key for admin SDK
- All environment variables configured

### Deploy Everything

```bash
firebase deploy
```

This deploys:

- Firebase Hosting (static assets)
- All Functions
- Firestore Rules
- Firestore Indexes

### Deploy Specific Components

#### Hosting Only

```bash
firebase deploy --only hosting
```

#### Functions Only

```bash
firebase deploy --only functions
```

#### Firestore Rules Only

```bash
firebase deploy --only firestore:rules
```

#### Firestore Indexes Only

```bash
firebase deploy --only firestore:indexes
```

#### Use Specific Project

```bash
firebase use <project-id>
firebase deploy
```

---

## Environment Configuration

### Development

**Frontend:**

- File: `packages/assets/.env.development`
- Variables: `VITE_*` prefix (exposed to browser)

**Backend:**

- File: `packages/functions/.runtimeconfig.json`
- Variables: Server-side config

### Production

**Frontend:**

- Set via CI/CD pipeline
- Variables written to `.env.production` during build

**Backend:**

- Runtime config set in Firebase console
- Or environment variables in Firebase deployment

---

## Shopify App Deployment

### Deploy App to Shopify

```bash
shopify app deploy
```

This:

- Deploys theme app extension
- Updates app configuration
- Pushes to Shopify app store

### Theme Extension Deployment

Theme extensions are deployed as part of the Shopify app deployment. The extension is built and included in the app package.

### Script Tag Registration

Script tags are registered via Shopify API when a shop installs the app. The script URL points to the hosted Preact bundle:

```
https://<firebase-hosting-url>/scripttag/avada-sale-pop.min.js
```

---

## SSL/HTTPS Configuration

### Development SSL

SSL certificates for local development are generated using:

```bash
yarn make:ssl
```

This creates:

- `ssl/key` - Private key
- `ssl/crt` - SSL certificate

**Location:** `/ssl/` (at project root)

### Using Custom Domain

1. Configure custom domain in Firebase Console
2. Update DNS records (CNAME or A record)
3. Verify domain ownership
4. SSL certificates are auto-provisioned by Firebase

---

## Monitoring and Logging

### View Function Logs

**CLI:**

```bash
firebase functions:log
```

**Web Console:**

- Firebase Console → Functions → Logs

### Hosting Logs

**Web Console:**

- Firebase Console → Hosting → Usage

### Firestore Monitoring

**Web Console:**

- Firebase Console → Firestore → Monitoring

### Error Tracking

For production error tracking, integrate:

- Firebase Crashlytics
- Custom error reporting functions

---

## Rollback Procedures

### Firebase Functions Rollback

1. Go to Firebase Console → Functions
2. Select previous deployment
3. Click "Rollback"

### Hosting Rollback

Option 1: Via Firebase Console

1. Go to Firebase Console → Hosting
2. Select release history
3. Click "Rollback" to previous version

Option 2: Via CLI

```bash
firebase hosting:rollback [version]
```

### Database Rollback

Firestore does not support automatic rollback. To restore data:

1. Use Firestore exports if available
2. Manually restore from backup
3. Implement point-in-time recovery pattern

---

## Performance Optimization

### Build Optimization

**Assets:**

- Vite optimizes automatically
- Code splitting via loadables
- Tree-shaking removes unused code

**Functions:**

- Babel transpilation for Node.js 20
- Dependencies bundled per function

### Hosting Optimization

Firebase Hosting provides:

- Global CDN distribution
- HTTP/2 support
- Automatic cache invalidation
- Gzip compression

### Database Optimization

- Composite indexes for complex queries
- Query pagination to limit data transfer
- Document size limits (1 MB per doc)

---

## Scaling Considerations

### Functions

- **Cold Starts:** First call after idle period (~1-3 seconds)
- **Concurrent Execution:** Up to 1000 concurrent instances
- **Timeout:** 9 minutes per execution
- **Memory:** Configurable (default: 256MB)

### Firestore

- **Read Operations:** 50,000/second
- **Write Operations:** 20,000/second
- **Document Size:** 1 MB limit
- **Database Size:** 1 TB per project

### Hosting

- **Bandwidth:** Included in Firebase Spark/Blaze plans
- **SSL:** Automatic with custom domains
- **CDN:** Global distribution included

---

## Backup Strategy

### Firestore Backups

Implement scheduled exports:

1. Firebase Console → Firestore → Export/Import
2. Schedule daily exports to Cloud Storage
3. Store backups in regional bucket

### Code Backups

Git provides version control for all code. For additional safety:

1. Tag releases in Git
2. Keep deployment artifacts in CI/CD
3. Store Firebase configuration in version control

---

## Security Best Practices

1. **Never Commit Secrets:**
   - Use `.gitignore` for `.env.*` files
   - Use CI/CD variables for production secrets

2. **Rotate Keys Regularly:**
   - Shopify API keys
   - Firebase service account keys

3. **Enable Security Rules:**
   - Firestore rules restrict access by shopId
   - Validate user authentication

4. **Monitor for Anomalies:**
   - Unusual function invocation patterns
   - Failed authentication attempts
   - Database query performance

5. **Keep Dependencies Updated:**
   - Regular `yarn upgrade` for security patches
   - Audit dependencies with `yarn audit`
