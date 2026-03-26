# Expo Boilerplate - Project Rules

## Project Overview

A React Native Expo project with TypeScript following a feature-based architecture with shared components.

---

## Code Style

- Use functional components with hooks; never class components.
- Use TypeScript strict mode throughout.
- Apply NativeWind for Tailwind CSS styling.
- Use 2-space indentation.
- Use meaningful variable names with auxiliary verbs (e.g., `isLoading`, `hasError`).
- Keep functions small and focused on a single responsibility.
- Use early returns to reduce nesting.
- Avoid magic numbers and strings — use constants.
- Use destructuring for props and state.
- Use `async/await` over promise chains.
- Use optional chaining (`?.`) and nullish coalescing (`??`).
- Prefer interfaces over types in TypeScript.
- Avoid enums; use maps instead.
- Use the `function` keyword for pure functions.
- Use declarative JSX.
- **NEVER use `console.log`** — always use `logger` from `@/utils/logger`.
- **ALWAYS use `@/` path alias** for imports (never relative paths like `../../../`).
- Run `bun run type-check` after editing code and before committing.

---

## Folder Structure

```
src/
  app/             # Expo Router app directory (routes)
  features/        # Feature modules (domain-driven, feature-based)
  shared/
    components/    # Reusable UI components
    hooks/         # Custom React hooks
    theme/         # Theme configuration (auto-generated)
    i18n/          # Internationalization
    providers/     # React context providers
    services/      # API & business logic services
  libs/            # External library integrations
  utils/           # Utility functions
  config/          # App configuration (environment, routes - auto-generated)
  resources/       # Generated asset resources (auto-generated)
  stores/          # Global state management (Zustand)
assets/            # Static assets (images, icons, fonts)
```

- Feature-specific folders **must** be prefixed with underscore: `_components`, `_screens`, `_hooks`, `_services`, `_types`.
- Each feature should have an `index.ts` exporting its public API.
- Use lowercase with dashes for directory names (e.g., `user-profile`).
- Use `index.tsx` files for cleaner imports.
- Favor named exports for components.
- File order: exported component, subcomponents, helpers, static content, types.

---

## Component Guidelines

- Use `ScreenView` as the base component for all screens.
- Create reusable components for common UI patterns.
- Implement proper loading states and error handling.
- Use proper TypeScript interfaces for component props.
- Keep components focused on a single responsibility.
- Extract complex logic into custom hooks.
- Use Expo's vector icons for all icon needs.
- Implement skeleton components for loading states.
- Implement responsive layouts that work across different device sizes.

---

## Safe Area Management

- Use `SafeAreaProvider` from `react-native-safe-area-context` globally.
- Wrap top-level components with `SafeAreaView` to handle notches and status bars.
- Use `SafeAreaScrollView` for scrollable content.
- Avoid hardcoding padding/margins for safe areas.

---

## State Management

- Use **Zustand** for global state management.
- Follow the store pattern established in `src/stores/`.
- Use React Context and `useReducer` for localized state when appropriate.
- Persist state to storage when appropriate using the storage utility.
- Keep store methods pure and focused on a single responsibility.

---

## Performance

- Use `React.memo` for components that render often but rarely change.
- Use `useCallback` for functions passed as props to memoized components.
- Use `useMemo` for expensive calculations.
- Use `FlatList` or `SectionList` instead of `map()` for lists.
- Implement proper list item recycling with `keyExtractor` and `getItemLayout`.
- Use `expo-image` for image caching and lazy loading.
- Use WebP format where supported.
- Implement lazy loading for screens and heavy components.
- Use the `useDebounce` hook for input fields and search.
- Implement proper pagination for large data sets.

---

## API & Data Fetching

- Use `apiClient` from `@/libs/api` for all API calls.
- Create service files in `src/shared/services/` or `src/features/[name]/_services/`.
- Use `callAPIHelper` from `@/utils/callAPIHelper` for consistent API call handling.
- `callAPIHelper` pattern: `API, payload, beforeSend, onSuccess, onError, onUnauthorized, onFinally`.
- Use TypeScript interfaces for all API responses.
- Use `react-query` for data fetching and caching; avoid excessive API calls.
- Set API base URL using `EXPO_PUBLIC_API_URL` in `.env.local`.
- Access environment variables via `ENV` from `@/config/environment`.

---

## Internationalization (i18n)

- Use the i18n system in `src/shared/i18n/` for all user-facing strings.
- Add locale files in `src/shared/i18n/locales/` (e.g., `en.ts`, `vi.ts`).
- Use the translation hook: `const { t } = useTranslation()` then `t("key")`.
- Add new translation keys to **all** locale files.
- Support multiple languages and RTL layouts.

---

## Assets & Resources

- Add images to `assets/images/` and icons to `assets/icons/`.
- After adding/removing assets, run: `bun run generate:assets`.
- Reference assets via auto-generated R resources: `R.images.name`, `R.icons.name`.
- Use `<Image source={R.images.logo} />` pattern.
- **NEVER hardcode asset paths** — always use the `R` resource object.

---

## Navigation

- Use **Expo Router** for declarative, file-based routing.
- Use type-safe routes from `@/config/routes` (auto-generated).
- Navigate with `router.push(ROUTES.tabs.home)` or `router.replace()`.
- Use `<Link href={ROUTES.tabs.home}>` for declarative links.
- After adding new routes in `src/app/`, run: `bun run generate:routes`.
- The app has 3 main tabs: **Home**, **Explore**, and **Profile**.
- Leverage deep linking and universal links for better user engagement.

---

## Styling

- Use NativeWind with Tailwind CSS classes for all styling.
- Use the theme hook: `const { theme } = useTheme()` for theme colors.
- Use NativeWind classes for theming: `bg-light-bg-primary dark:bg-dark-bg-primary`.
- Avoid inline styles unless absolutely necessary.
- Implement dark mode support using Expo's `useColorScheme`.

---

## Animation

- Use `react-native-reanimated` for complex animations.
- Use `react-native-gesture-handler` for performant gestures.
- Use `useNativeDriver: true` whenever possible for better performance.
- Enable `LayoutAnimation` for Android with `UIManager.setLayoutAnimationEnabledExperimental`.

---

## Error Handling

- Use `try/catch` for all async operations.
- Use the `useToast` hook for user-facing error messages.
- Implement fallback UI for components that might fail.
- Handle network errors gracefully with retry mechanisms.
- Validate user input before submission.
- Use Zod for runtime validation.
- Implement global error boundaries for unexpected errors.

---

## Security

- Store sensitive data in `SecureStore`, not `AsyncStorage`.
- Validate all user input on both client and server.
- Use HTTPS for all network requests.
- Never store API keys or secrets in client code — use environment variables.
- Use `react-native-encrypted-storage` for sensitive data storage.

---

## Environment Variables

- Add variables to `.env.example`.
- Use `EXPO_PUBLIC_` prefix for client-side variables.
- After modifying `.env.example`, run: `bun run generate:env`.
- Access via: `import { ENV } from "@/config/environment"` then `ENV.VARIABLE_NAME`.
- **NEVER hardcode API URLs or secrets**.

---

## Scripts Reference

| Command | Purpose |
|---|---|
| `bun run start` | Start dev server |
| `bun run ios` | Run on iOS |
| `bun run android` | Run on Android |
| `bun run type-check` | TypeScript type check (run before every commit) |
| `bun run lint` | Lint code |
| `bun run format` | Format code |
| `bun run generate:assets` | Regenerate R resources after asset changes |
| `bun run generate:routes` | Regenerate routes after adding/removing routes |
| `bun run generate:env` | Regenerate env config after `.env.example` changes |
| `bun run prebuild` | Generate native folders |
| `bun run pod` | Install iOS pods |

**When to run generation scripts:**
- After adding images/icons: `bun run generate:assets`
- After adding/removing routes: `bun run generate:routes`
- After changing `.env.example`: `bun run generate:env`
- Before every commit: `bun run type-check` (REQUIRED)
- After `git pull` with native changes: `bun run prebuild`

---

## Feature Development

Structure for a new feature:

```
src/features/[feature-name]/
  _components/
  _screens/
  _hooks/
  _services/
  _types/
  index.ts        # Export public API
```

Steps to add a new feature:
1. Create feature folder: `mkdir -p src/features/new-feature/{_screens,_components,_hooks}`
2. Create screen in `_screens/`
3. Export from feature: `export { Screen } from "./_screens/Screen"`
4. Create route in `src/app/` that imports from `@/features/new-feature`
5. Run: `bun run generate:routes`

Keep feature code isolated — use `_services/` for feature-specific logic. Use `shared/` for code used across multiple features.

---

## Common Tasks Quick Reference

**Add new screen:**
1. Create in `src/features/[feature]/_screens/`
2. Export from `src/features/[feature]/index.ts`
3. Create route in `src/app/`
4. Run `bun run generate:routes`

**Add API endpoint:**
1. Add to service in `src/shared/services/` or `src/features/[feature]/_services/`
2. Use `callAPIHelper` in the component

**Add translation:**
1. Add key to `src/shared/i18n/locales/[lang].ts` for all languages
2. Use: `const { t } = useTranslation(); t("key")`

**Add environment variable:**
1. Add to `.env.example` (use `EXPO_PUBLIC_` prefix for client-side)
2. Run `bun run generate:env`
3. Access via `ENV.VARIABLE_NAME`

**Add image or icon:**
1. Add to `assets/images/` or `assets/icons/`
2. Run `bun run generate:assets`
3. Use `R.images.name` or `R.icons.name`

---

## Git Workflow

- Use feature branches for new features.
- Write commit messages in English using conventional commits format.
- Commit message prefixes: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`
- Keep commits small and focused.
- Always run `bun run type-check` before committing (REQUIRED).
- Before committing and pushing, ask the user for confirmation.
- Keep the main/develop branch stable and deployable.
- Use pull requests for code review.

---

## Package Compatibility Notes

- React Native: `0.77.x` with Expo SDK 52
- TypeScript: `5.x`
- NativeWind: `4.0.1` with Tailwind CSS `3.4.10`
- If NativeWind errors occur, check `babel.config.js` configuration.

---

## CRITICAL RULES

> These must always be followed without exception.

- **NEVER** use `console.log` — always use `logger` from `@/utils/logger`.
- **NEVER** use relative imports (`../../../`) — always use `@/` path alias.
- **NEVER** hardcode asset paths — always use `R.images.name` or `R.icons.name`.
- **NEVER** hardcode API URLs or secrets — always use environment variables.
- **ALWAYS** run `bun run type-check` before committing (REQUIRED).
- **ALWAYS** use TypeScript strict mode with proper interfaces.
- **ALWAYS** prefix feature-specific folders with underscore (`_components`, `_screens`, `_hooks`, `_services`, `_types`).
- **ALWAYS** use type-safe routes: `ROUTES.tabs.home` instead of hardcoded paths.
- **ALWAYS** use `ENV` from `@/config/environment` for environment variables.
- **ALWAYS** use `callAPIHelper` for API calls with proper error handling.
- **ALWAYS** regenerate after changes:
  - `bun run generate:assets` (after adding images/icons)
  - `bun run generate:routes` (after adding/removing routes)
  - `bun run generate:env` (after changing `.env.example`)
