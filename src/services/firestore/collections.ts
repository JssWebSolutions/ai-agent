export const COLLECTIONS = {
  USERS: 'users',
  AGENTS: 'agents',
  SETTINGS: 'settings',
  USAGE: 'usage',
  USER_COUNTS: 'userCounts',
} as const;

export type CollectionName = keyof typeof COLLECTIONS;

export const SUBCOLLECTIONS = {
  ANALYTICS: 'analytics',
  TRAINING: 'training'
} as const;
