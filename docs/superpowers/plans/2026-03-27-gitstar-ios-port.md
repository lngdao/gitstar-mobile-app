# Gitstar iOS Port — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port the Gitstar iOS SwiftUI app (4 tabs, feed system, splash screen) to React Native Expo, matching the iOS UI 1:1.

**Architecture:** Feature-based architecture with Expo Router tabs. Home feed with sub-tab switcher (Community/For You/Agents), FeedCard components, animated splash screen overlay. Mock data for all feeds.

**Tech Stack:** Expo SDK 55, React Native, TypeScript, NativeWind/Tailwind, Expo Router, Reanimated, Ionicons

---

**IMPORTANT NOTES FOR IMPLEMENTER:**
- Source iOS project at `_ignore/Gitstar-mobile/Gitstar/` — reference for exact UI/data
- Use `@/` path alias for all imports
- NEVER use `console.log` — use `logger` from `@/utils/logger`
- Use existing shared components (`Box`, `Text`, `Button`) where appropriate
- Brand color: `#B6573A` (warm terracotta)
- Follow feature-based folder structure with `_` prefix for internal folders

---

### Task 1: Update Brand Color

**Files:**
- Modify: `src/shared/theme/colors.ts`

- [ ] **Step 1: Update primary color scale to brand terracotta `#B6573A`**

Change `colors.primary` from blue to:
```ts
primary: {
  300: '#D4917A',
  400: '#C5745A',
  500: '#B6573A', // Main brand color (terracotta)
  600: '#9A4A31',
  700: '#7E3D28',
},
```

- [ ] **Step 2: Run type-check**

Run: `bun run type-check`

---

### Task 2: Update Tab Structure (4 tabs)

**Files:**
- Modify: `src/app/(tabs)/_layout.tsx`
- Create: `src/app/(tabs)/trending.tsx`
- Create: `src/app/(tabs)/notifications.tsx`
- Create: `src/app/(tabs)/bookmarks.tsx`
- Delete: `src/app/(tabs)/explore.tsx`
- Delete: `src/app/(tabs)/profile.tsx`
- Modify: `src/shared/i18n/locales/en.ts`
- Modify: `src/shared/i18n/locales/vi.ts`

- [ ] **Step 1: Update i18n with new tab names**

en.ts navigation:
```ts
navigation: {
  home: 'Home',
  trending: 'Trending',
  notifications: 'Notifications',
  bookmarks: 'Bookmarks',
},
```

vi.ts navigation:
```ts
navigation: {
  home: 'Trang chủ',
  trending: 'Xu hướng',
  notifications: 'Thông báo',
  bookmarks: 'Dấu trang',
},
```

- [ ] **Step 2: Create placeholder features**

Create `src/features/trending/`, `src/features/notifications/`, `src/features/bookmarks/` with placeholder screens matching iOS placeholders.

- [ ] **Step 3: Create route files**

Create `trending.tsx`, `notifications.tsx`, `bookmarks.tsx` in `src/app/(tabs)/`.
Delete `explore.tsx` and `profile.tsx`.

- [ ] **Step 4: Update `_layout.tsx`**

4 tabs: Home (home-outline), Trending (flame-outline), Notifications (notifications-outline), Bookmarks (bookmark-outline).

- [ ] **Step 5: Run `bun run generate:routes` and `bun run type-check`**

---

### Task 3: Feed Types & Mock Data

**Files:**
- Create: `src/features/home/_types/feed.ts`
- Create: `src/features/home/_types/index.ts`
- Create: `src/features/home/_data/mock-feed.ts`

- [ ] **Step 1: Create feed types**

Port `FeedModels.swift` → TypeScript interfaces: `FeedAuthor`, `FeedEvent`, `EventType`, `HomeTab`.

- [ ] **Step 2: Create mock data**

Port all 3 mock arrays (community, forYou, agents) with 11 total items.

---

### Task 4: Feed Components

**Files:**
- Create: `src/features/home/_components/Avatar.tsx`
- Create: `src/features/home/_components/RepoBadge.tsx`
- Create: `src/features/home/_components/EventTypeBadge.tsx`
- Create: `src/features/home/_components/ActionButton.tsx`
- Create: `src/features/home/_components/FeedCard.tsx`
- Create: `src/features/home/_components/HomeTabBar.tsx`
- Create: `src/features/home/_components/index.ts`

- [ ] **Step 1: Create Avatar** — circle with initial letter + deterministic color
- [ ] **Step 2: Create RepoBadge** — owner/repo chip with folder icon
- [ ] **Step 3: Create EventTypeBadge** — colored badge for Issue/PR/Commit/Release
- [ ] **Step 4: Create ActionButton** — icon + formatted count
- [ ] **Step 5: Create FeedCard** — compose all sub-components
- [ ] **Step 6: Create HomeTabBar** — 3 sub-tabs with animated indicator

---

### Task 5: Home Screen

**Files:**
- Modify: `src/features/home/_screens/HomeScreen.tsx`
- Modify: `src/features/home/index.ts`
- Delete: `src/features/home/_components/WelcomeCard.tsx`

- [ ] **Step 1: Rewrite HomeScreen**

Navigation header with star icon + "Gitstar" title + search button.
HomeTabBar + ScrollView with FeedCard list. "You've reached the end" footer.

---

### Task 6: Splash Screen

**Files:**
- Create: `src/features/splash/_components/SplashOverlay.tsx`
- Create: `src/features/splash/index.ts`
- Modify: `src/app/index.tsx`

- [ ] **Step 1: Create SplashOverlay**

Brand background `#B6573A`, logo image scale (0.85→1) + fade in using Reanimated.
1.8s duration, then fade out.

- [ ] **Step 2: Update index.tsx**

Show SplashOverlay on top, navigate to tabs after animation completes.

---

### Task 7: Cleanup & Verify

- [ ] **Step 1: Run `bun run generate:routes`**
- [ ] **Step 2: Run `bun run type-check`**
- [ ] **Step 3: Verify all imports use `@/` alias**
