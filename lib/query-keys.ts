/**
 * Centralized query keys. Group by feature so cache invalidation has a single source of truth.
 */
export const queryKeys = {
  auth: {
    session: ['auth', 'session'] as const,
  },
  user: {
    me: ['user', 'me'] as const,
    byId: (id: string) => ['user', id] as const,
  },
} as const
