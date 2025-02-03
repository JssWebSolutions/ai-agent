export const COLLECTIONS = {
  USERS: 'users',
  AGENTS: 'agents',
  SETTINGS: 'settings', // Admin only
  USAGE: 'usage', // User specific
  USER_COUNTS: 'userCounts', // Admin only
} as const;

export const SYSTEM_DOCUMENTS = {
  USER_COUNT: 'userCount',
  SYSTEM_SETTINGS: 'systemSettings',
  API_KEYS: 'api-keys',
  PAYMENT_SETTINGS: 'payment-settings'
} as const;

export type CollectionName = keyof typeof COLLECTIONS;
export type SystemDocument = keyof typeof SYSTEM_DOCUMENTS;
