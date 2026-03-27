/**
 * Centralized route definitions for type-safe navigation
 * Auto-generated from app directory structure
 * DO NOT EDIT MANUALLY - Run 'bun run generate:routes' to update
 *
 * Usage:
 * ```tsx
 * import { ROUTES } from '@/config/routes';
 * import { Link, useRouter } from 'expo-router';
 *
 * // Simple routes
 * <Link href={ROUTES.index}>Go Home</Link>
 * <Link href={ROUTES.login}>Login</Link>
 *
 * // Tab routes
 * <Link href={ROUTES.tabs.home}>Home</Link>
 * <Link href={ROUTES.tabs.transfer}>Transfer</Link>
 *
 * // Programmatic navigation
 * const router = useRouter();
 * router.push(ROUTES.tabs.home);
 * ```
 */

export const ROUTES = {
  index: "/",
  tabs: {
    bookmarks: "/(tabs)/bookmarks",
    home: "/(tabs)/home",
    notifications: "/(tabs)/notifications",
    trending: "/(tabs)/trending",
  },
} as const;

/**
 * Helper to check if a path is a valid route
 */
export const isValidRoute = (path: string): boolean => {
  const allRoutes: string[] = [];

  const extractRoutes = (obj: any): void => {
    Object.values(obj).forEach((value) => {
      if (typeof value === "string") {
        allRoutes.push(value);
      } else if (typeof value === "object" && value !== null) {
        extractRoutes(value);
      }
    });
  };

  extractRoutes(ROUTES);
  return allRoutes.includes(path);
};
