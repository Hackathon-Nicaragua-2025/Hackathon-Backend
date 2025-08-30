export enum ModuleName {
  BIRD_CATALOG = 'Bird Catalog',
  RESERVES = 'Reserves',
  BOOKINGS = 'Bookings',
  SIGHTINGS = 'Sightings',
  GUIDES = 'Guides',
  EVENTS = 'Events',
  EDUCATIONAL = 'Educational',
  USERS = 'Users',
  AUDIT_LOG = 'Audit Log',
  AUTHENTICATION = 'Authentication',
  LOCATIONS = 'Locations',
  PAYMENTS = 'Payments',
  STATISTICS = 'Statistics',
  REVIEWS = 'Reviews',
  NOTIFICATIONS = 'Notifications',
  MULTIMEDIA = 'Multimedia',
}

// Strongly typed structure for PermissionActions
export const PermissionActions = {
  BIRD_CATALOG: {
    READ: 'bird_catalog_read',
    CREATE: 'bird_catalog_create',
    UPDATE: 'bird_catalog_update',
    DELETE: 'bird_catalog_delete',
    MANAGE: 'bird_catalog_manage',
  },
  RESERVES: {
    READ: 'reserves_read',
    CREATE: 'reserves_create',
    UPDATE: 'reserves_update',
    DELETE: 'reserves_delete',
    MANAGE: 'reserves_manage',
  },
  BOOKINGS: {
    READ: 'bookings_read',
    CREATE: 'bookings_create',
    UPDATE: 'bookings_update',
    DELETE: 'bookings_delete',
    MANAGE: 'bookings_manage',
    CANCEL: 'bookings_cancel',
  },
  SIGHTINGS: {
    READ: 'sightings_read',
    CREATE: 'sightings_create',
    UPDATE: 'sightings_update',
    DELETE: 'sightings_delete',
    MANAGE: 'sightings_manage',
    VERIFY: 'sightings_verify',
  },
  GUIDES: {
    READ: 'guides_read',
    CREATE: 'guides_create',
    UPDATE: 'guides_update',
    DELETE: 'guides_delete',
    MANAGE: 'guides_manage',
    VERIFY: 'guides_verify',
  },
  EVENTS: {
    READ: 'events_read',
    CREATE: 'events_create',
    UPDATE: 'events_update',
    DELETE: 'events_delete',
    MANAGE: 'events_manage',
  },
  EDUCATIONAL: {
    READ: 'educational_read',
    CREATE: 'educational_create',
    UPDATE: 'educational_update',
    DELETE: 'educational_delete',
    MANAGE: 'educational_manage',
  },
  USERS: {
    READ: 'users_read',
    CREATE: 'users_create',
    UPDATE: 'users_update',
    DELETE: 'users_delete',
    MANAGE: 'users_manage',
  },
  AUDIT_LOG: {
    READ: 'audit_log_read',
    MANAGE: 'audit_log_manage',
  },
  AUTHENTICATION: {
    REGISTER: 'auth_register',
    LOGIN: 'auth_login',
    REFRESH_TOKEN: 'auth_refresh_token',
    ME: 'auth_me',
    LOGOUT: 'auth_logout',
  },
  LOCATIONS: {
    READ: 'locations_read',
    CREATE: 'locations_create',
    UPDATE: 'locations_update',
    DELETE: 'locations_delete',
    MANAGE: 'locations_manage',
  },
  PAYMENTS: {
    READ: 'payments_read',
    CREATE: 'payments_create',
    UPDATE: 'payments_update',
    DELETE: 'payments_delete',
    MANAGE: 'payments_manage',
    REFUND: 'payments_refund',
  },
  STATISTICS: {
    READ: 'statistics_read',
    MANAGE: 'statistics_manage',
  },
  REVIEWS: {
    READ: 'reviews_read',
    CREATE: 'reviews_create',
    UPDATE: 'reviews_update',
    DELETE: 'reviews_delete',
    MANAGE: 'reviews_manage',
  },
  NOTIFICATIONS: {
    READ: 'notifications_read',
    CREATE: 'notifications_create',
    UPDATE: 'notifications_update',
    DELETE: 'notifications_delete',
    MANAGE: 'notifications_manage',
  },
  MULTIMEDIA: {
    READ: 'multimedia_read',
    CREATE: 'multimedia_create',
    UPDATE: 'multimedia_update',
    DELETE: 'multimedia_delete',
    MANAGE: 'multimedia_manage',
  },
} as const satisfies ModulePermissions;

// Interface to enforce the structure of permissions
export type ModulePermissions = {
  [key in keyof typeof ModuleName]: {
    [key: string]: string;
  };
};

// This type ensures that only existing keys inside PermissionActions can be used
export type PermissionAction =
  (typeof PermissionActions)[keyof typeof PermissionActions][keyof (typeof PermissionActions)[keyof typeof PermissionActions]];
