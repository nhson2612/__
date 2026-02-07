# Source Tree Analysis

## Project Overview

```
app-name/
├── packages/                    # Monorepo packages
│   ├── assets/                 # React/Vite frontend
│   ├── functions/              # Firebase Functions backend
│   └── scripttag/             # Preact script tag component
├── extensions/                 # Shopify theme extensions
│   └── avada-theme-app-extension/
├── docs/                      # Generated documentation
├── static/                    # Build output (deployed to Firebase Hosting)
├── _bmad/                    # BMAD workflow system (internal)
└── Configuration files...
```

---

## Part: packages/assets (Frontend)

```
packages/assets/src/
├── actions/                   # Redux-style actions for state management
├── components/                # Reusable React components
│   ├── AppBridgeProvider/      # Shopify App Bridge context
│   ├── AppNews/              # App news component
│   ├── Banner/               # Information banners
│   ├── DesktopPositionInput/   # Position input UI
│   ├── ErrorBoundary/         # React error boundary
│   ├── Footer/               # App footer
│   ├── HomePage/             # Main page component
│   ├── Integration/          # Integration guide components
│   ├── Loading/              # Loading indicator
│   ├── Molecules/            # Complex composable components
│   │   └── FullscreenModal/ # Fullscreen modal
│   ├── NotificationList/      # Notification list with item
│   │   └── NotificationItem/ # Single notification
│   ├── NotificationPopup/     # Popup notification
│   ├── RangeSliderWithUnit/  # Range slider component
│   ├── ReactRouterLink/      # Router link wrapper
│   ├── ScreenPreview/        # Mobile preview component
│   ├── SettingsCard/         # Settings UI
│   │   ├── DisplaySetting/   # Display config
│   │   └── TriggerSetting/   # Trigger config
│   ├── SettingsSkeleton/     # Loading skeleton
│   └── Sheet/               # Bottom/side sheet
│       ├── SheetHeader/
│       └── SheetBody/
├── config/                    # Configuration files
│   └── integration/
├── const/                     # Constants
├── contexts/                  # React contexts
├── helpers/                   # Helper utilities
│   └── utils/
├── hooks/                     # Custom React hooks
│   ├── api/                  # API-related hooks
│   ├── form/                 # Form hooks
│   ├── popup/                # Popup hooks
│   ├── table/                # Table hooks
│   └── utils/                # Utility hooks
├── layouts/                   # Page layouts
│   ├── AppLayout/            # Main app layout
│   ├── EmbeddedLayout/        # Embedded app layout
│   └── FullLayout/           # Full page layout
├── loadables/                 # Code-split route components
│   ├── App/                  # Main app entry
│   ├── Home/                 # Home route
│   ├── NotFound/             # 404 page
│   ├── Notifications/         # Notifications route
│   ├── OptionalScopes/       # Scopes route
│   ├── Samples/              # Samples route
│   ├── Settings/             # Settings route
│   └── Tables/               # Tables route
├── pages/                     # Page components
│   ├── App/                  # App page
│   ├── FullscreenPageA/      # Fullscreen demo page
│   ├── Home/                 # Home page
│   ├── NotFound/             # 404 page
│   ├── Notifications/         # Notifications page
│   ├── OptionalScopes/       # Scopes page
│   ├── Samples/              # Samples page
│   ├── Settings/             # Settings page
│   └── Tables/               # Tables page
├── reducers/                  # State reducers
│   └── storeReducer.js       # Main store reducer
├── resources/                 # App resources
│   └── icons/               # Icon assets
├── routes/                    # Route configuration
├── services/                  # API services
└── styles/                    # Global styles
    ├── components/           # Component styles
    └── layout/              # Layout styles
```

### Entry Points

- `index.html` - Embedded app HTML template
- `embed-template.html` - Embedded app template
- `standalone.html` - Standalone app template
- `src/pages/App/App.js` - Main app component

---

## Part: packages/functions (Backend)

```
packages/functions/src/
├── commands/                  # Command handlers (PubSub, etc.)
├── config/                    # Configuration files
├── const/                     # Constants
├── controllers/               # Business logic controllers
│   ├── appNewsController.js   # App news operations
│   ├── notificationController.js # Notification CRUD
│   ├── settingController.js    # Settings operations
│   ├── shopController.js       # Shop operations
│   ├── subscriptionController.js # Subscription CRUD
│   ├── themeAppExtController.js # Theme extension
│   └── webhookController.js   # Webhook handlers
├── graphql/                   # GraphQL queries/mutations
├── handlers/                  # HTTP request handlers
│   ├── makeRequest.js               # Main API handler
│   ├── apiClient.js          # API client handler
│   ├── apiSa.js             # API SA handler
│   ├── auth.js               # Auth handler
│   ├── authSa.js             # Auth SA handler
│   ├── embed.js              # Embedded app handler
│   └── webhook.js           # Webhook handler
├── helpers/                   # Helper utilities
│   ├── datetime/            # Date/time utilities
│   ├── graphql/             # GraphQL helpers
│   └── utils/               # General utilities
├── middleware/                # Koa middleware
│   ├── errorHandler.js       # Error handling
│   └── settingInputMiddleware.js # Settings validation
├── presenters/               # Data presenters (formatting)
├── repositories/              # Firestore repositories (data access)
│   ├── appNewsRepository.js # App news data
│   ├── helper.js            # Repository helpers
│   ├── notificationRepository.js # Notifications
│   ├── sample.js            # Sample data
│   ├── sampleRepository.js  # Sample CRUD
│   ├── settingRepository.js # Settings
│   ├── shopInfoRepository.js # Shop info
│   ├── shopRepository.js    # Shops
│   └── subscriptionsRepository.js # Subscriptions
├── routes/                    # Koa route definitions
│   ├── makeRequest.js               # Main API routes
│   ├── apiClient.js          # API client routes
│   ├── notifications.js      # Notification routes
│   ├── settings.js           # Settings routes
│   └── webhook.js           # Webhook routes
└── services/                  # Business logic services
```

### Entry Points

- `src/index.js` - Main Firebase Functions entry point
- `src/handlers/makeRequest.js` - Main API handler
- `src/routes/makeRequest.js` - API router

---

## Part: packages/scripttag (Script Tag)

```
packages/scripttag/src/
├── components/                # Preact components
│   └── NotificationPopup/   # Notification popup
├── const/                     # Constants
├── helpers/                   # Helper utilities
│   └── api/                # API helper functions
├── managers/                  # State managers
└── [index.js]               # Main entry point
```

### Entry Points

- `src/index.js` - Main script entry point
- Output: `avada-sale-pop.min.js` (built to `static/scripttag/`)

---

## Part: extensions/avada-theme-app-extension (Shopify Extension)

```
extensions/avada-theme-app-extension/
├── assets/                    # Extension assets
│   └── avada-sale-pop.min.js # Script tag output
├── blocks/                    # Theme app extension blocks
│   └── avada-sale-pop.liquid # Block template
├── locales/                   # Localization
│   └── en.default.json       # English translations
├── snippets/                  # Theme snippets
│   └── stars.liquid          # Star rating snippet
└── shopify.extension.toml     # Extension config
```

### Entry Points

- `shopify.extension.toml` - Extension configuration
- `blocks/avada-sale-pop.liquid` - Main block template

---

## Integration Points

### API Communication

```
assets (Frontend)
    ↓ HTTP/axios
    ┌─────────────────────────────┐
    │  /api/** → api function   │
    │  /auth/** → auth function │
    │  /embed/** → embed function│
    └─────────────────────────────┘
              functions (Backend)
```

### Shopify Integration

```
functions (Backend)
    ↓ shopify-api-node
    ┌─────────────────────────┐
    │  Shopify Admin API     │
    │  Shopify Storefront API │
    └─────────────────────────┘

extension (Theme App)
    ↓ Shopify Theme
    ┌─────────────────────────┐
    │  Liquid Templates     │
    │  Theme Blocks        │
    └─────────────────────────┘
```

### Firebase Integration

```
assets (Frontend) ←→ Firestore (Client SDK)
functions (Backend) ←→ Firestore (Admin SDK)
```

### Script Tag Injection

```
scripttag (Preact)
    ↓ Built to .min.js
    ↓ Registered via Shopify API
    ↓ Injected into theme
    ┌─────────────────────────┐
    │  Store Frontend       │
    └─────────────────────────┘
```

---

## Critical Directory Summary

| Part          | Directory       | Purpose                       |
| ------------- | --------------- | ----------------------------- |
| **assets**    | `components/`   | Reusable UI components        |
| **assets**    | `loadables/`    | Code-split route components   |
| **assets**    | `hooks/`        | Custom React hooks            |
| **functions** | `controllers/`  | Business logic layer          |
| **functions** | `repositories/` | Data access layer (Firestore) |
| **functions** | `routes/`       | HTTP route definitions        |
| **functions** | `handlers/`     | Request/response handlers     |
| **scripttag** | `components/`   | Preact components             |
| **extension** | `blocks/`       | Theme app extension blocks    |

---

## File Organization Patterns

### Frontend (assets)

- **Container/Presentational**: Components separated by logic vs. display
- **Code Splitting**: Loadables for performance
- **Hooks**: Custom hooks for reusable logic
- **Services**: API client functions
- **Reducers**: State management with Context API

### Backend (functions)

- **MVC Pattern**: Controllers, Routes, Repositories
- **Middleware**: Koa middleware for cross-cutting concerns
- **Handlers**: HTTP request/response handling
- **Presenters**: Data formatting layer
- **Services**: Business logic layer

### ScriptTag (scripttag)

- **Lightweight**: Minimal dependencies
- **Managers**: State management
- **Helpers**: Utility functions
