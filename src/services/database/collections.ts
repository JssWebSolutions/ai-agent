export const COLLECTIONS = {
  USERS: 'users',
  AGENTS: 'agents',
  SETTINGS: 'settings',
  USAGE: 'usage',
  USER_COUNTS: 'userCounts',
} as const;

export const SYSTEM_DOCUMENTS = {
  USER_COUNT: 'userCount',
  SYSTEM_SETTINGS: 'systemSettings',
  API_KEYS: 'api-keys',
  PAYMENT_SETTINGS: 'payment-settings'
} as const;

export type CollectionName = keyof typeof COLLECTIONS;
export type SystemDocument = keyof typeof SYSTEM_DOCUMENTS;
