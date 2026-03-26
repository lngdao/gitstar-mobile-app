export const ROUTES = {
  index: '/',
  tabs: {
    home: '/(tabs)/home',
    explore: '/(tabs)/explore',
    profile: '/(tabs)/profile',
  },
} as const;

export const isValidRoute = (path: string): boolean => {
  const allRoutes: string[] = [];
  const extractRoutes = (obj: any): void => {
    Object.values(obj).forEach((value) => {
      if (typeof value === 'string') allRoutes.push(value);
      else if (typeof value === 'object' && value !== null) extractRoutes(value);
    });
  };
  extractRoutes(ROUTES);
  return allRoutes.includes(path);
};
