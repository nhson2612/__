# Component Inventory - Assets (Frontend)

## Overview

This document lists all UI components in the `assets` package, categorized by type and usage.

---

## Layout Components

| Component         | Path                        | Purpose                             | Reusability |
| ----------------- | --------------------------- | ----------------------------------- | ----------- |
| **Footer**        | `components/Footer/`        | App footer with links and copyright | High        |
| **ErrorBoundary** | `components/ErrorBoundary/` | Catches and displays React errors   | High        |
| **Loading**       | `components/Loading/`       | Loading spinner/skeleton            | High        |

---

## App Integration Components

| Component             | Path                            | Purpose                             | Reusability      |
| --------------------- | ------------------------------- | ----------------------------------- | ---------------- |
| **AppBridgeProvider** | `components/AppBridgeProvider/` | Shopify App Bridge context provider | High (singleton) |
| **ReactRouterLink**   | `components/ReactRouterLink/`   | Custom router link component        | High             |

---

## Page Components

| Component            | Path                           | Purpose                            | Reusability |
| -------------------- | ------------------------------ | ---------------------------------- | ----------- |
| **HomePage**         | `components/HomePage/`         | Main dashboard/home page           | Medium      |
| **SettingsSkeleton** | `components/SettingsSkeleton/` | Loading skeleton for settings page | Medium      |

---

## Notification Components

| Component             | Path                                            | Purpose                               | Reusability |
| --------------------- | ----------------------------------------------- | ------------------------------------- | ----------- |
| **NotificationList**  | `components/NotificationList/`                  | List of notifications with pagination | Medium      |
| **NotificationItem**  | `components/NotificationList/NotificationItem/` | Single notification item              | High        |
| **NotificationPopup** | `components/NotificationPopup/`                 | Popup notification display            | Medium      |

---

## App News Components

| Component        | Path                  | Purpose                  | Reusability |
| ---------------- | --------------------- | ------------------------ | ----------- |
| **AppNewsSheet** | `components/AppNews/` | Sheet/modal for app news | Low         |

---

## Settings Components

| Component          | Path                                      | Purpose                       | Reusability |
| ------------------ | ----------------------------------------- | ----------------------------- | ----------- |
| **SettingsCard**   | `components/SettingsCard/`                | Card component for settings   | High        |
| **DisplaySetting** | `components/SettingsCard/DisplaySetting/` | Display configuration setting | Medium      |
| **TriggerSetting** | `components/SettingsCard/TriggerSetting/` | Trigger configuration setting | Medium      |

---

## Integration Components

| Component               | Path                      | Purpose                             | Reusability |
| ----------------------- | ------------------------- | ----------------------------------- | ----------- |
| **IntegrationCard**     | `components/Integration/` | Integration status/instruction card | High        |
| **IntegrationTemplate** | `components/Integration/` | Template for integration guides     | Low         |

---

## UI Molecule Components

| Component           | Path                                    | Purpose                     | Reusability |
| ------------------- | --------------------------------------- | --------------------------- | ----------- |
| **FullscreenModal** | `components/Molecules/FullscreenModal/` | Fullscreen modal overlay    | High        |
| **Sheet**           | `components/Sheet/`                     | Bottom/side sheet component | High        |
| - `SheetHeader`     | `components/Sheet/`                     | Sheet header                | High        |
| - `SheetBody`       | `components/Sheet/`                     | Sheet body content          | High        |

---

## Utility Components

| Component                | Path                               | Purpose                                                  | Reusability |
| ------------------------ | ---------------------------------- | -------------------------------------------------------- | ----------- |
| **Banner**               | `components/Banner/`               | - **SyncNotificationsBanner**: Sync notifications banner | Low         |
| **DesktopPositionInput** | `components/DesktopPositionInput/` | Position input for desktop notifications                 | Medium      |
| **RangeSliderWithUnit**  | `components/RangeSliderWithUnit/`  | Slider with unit display                                 | Medium      |
| **ScreenPreview**        | `components/ScreenPreview/`        | - **MobileScreenPreview**: Mobile preview                | Low         |

---

## Loadable Components (Code Splitting)

| Component          | Path                        | Purpose               |
| ------------------ | --------------------------- | --------------------- |
| **App**            | `loadables/App/`            | Main app entry point  |
| **Home**           | `loadables/Home/`           | Home route            |
| **Samples**        | `loadables/Samples/`        | Samples route         |
| **Tables**         | `loadables/Tables/`         | Tables route          |
| **OptionalScopes** | `loadables/OptionalScopes/` | Optional scopes route |
| **NotFound**       | `loadables/NotFound/`       | 404 not found page    |
| **Notifications**  | `loadables/Notifications/`  | Notifications route   |
| **Settings**       | `loadables/Settings/`       | Settings route        |

---

## Component Dependencies

### Shopify Polaris Components Used

The following Polaris UI components are used throughout the app:

- `AppProvider` - App-wide context
- `Card` - Content cards
- `Button` - Action buttons
- `TextField` - Text input
- `Banner` - Information banners
- `Spinner` - Loading indicator
- `Layout`, `LegacyCard`, `LegacyStack` - Layout
- `Checkbox`, `Select`, `RadioButton` - Form inputs
- `Modal`, `ModalOverlay` - Modals
- `Navigation`, `TopBar` - Navigation
- `Icon` - Icons

### Custom Hooks

- Located in `helpers/` directory
- Reusable React hooks for common patterns

---

## Component Organization Pattern

```
components/
├── Layout/              # Page layout components
├── Integration/          # Shopify integration components
├── Notification/         # Notification-specific components
├── Settings/            # Settings UI components
├── Molecules/           # Complex composable components
└── Utility/             # Reusable utility components

loadables/
└── {RouteName}/         # Code-split route components
```

---

## Design System

**Primary Design System:** Shopify Polaris 13.9.1

**Design Principles:**

- Consistent with Shopify admin UI
- Responsive design (mobile-first)
- Accessible (WCAG compliant)
- Light/dark mode support (via Polaris)

**Custom Components:**
All custom components extend or compose Polaris components for consistency.

---

## Component Patterns

### 1. Higher-Order Components

- `AppBridgeProvider` - Wraps app with Shopify context
- `ErrorBoundary` - Wraps app to catch errors

### 2. Container/Presentational Pattern

- Container components fetch data (via API)
- Presentational components display UI
- Example: `NotificationList` (container) + `NotificationItem` (presentational)

### 3. Code Splitting

- Loadable components for routes
- Dynamic imports for performance
- Loaded via React Router

### 4. Compound Components

- `SettingsCard` with `DisplaySetting` and `TriggerSetting`
- `Sheet` with `SheetHeader` and `SheetBody`
- Allows flexible composition
