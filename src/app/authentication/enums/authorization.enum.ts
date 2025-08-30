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
  },
  RESERVES: {
    READ: 'reserves_read',
    CREATE: 'reserves_create',
    UPDATE: 'reserves_update',
    DELETE: 'reserves_delete',
  },
  BOOKINGS: {
    CREATE: 'booking_create',
    VIEW: 'booking_view',
    MANAGE: 'booking_manage',
  },
  SIGHTINGS: {
    CREATE: 'sighting_create',
    VIEW: 'sighting_view',
    MANAGE: 'sighting_manage',
  },
  GUIDES: {
    MANAGE: 'guide_manage',
    VERIFY: 'guide_verify',
  },
  EVENTS: {
    READ: 'events_read',
    CREATE: 'events_create',
    MANAGE: 'events_manage',
  },
  EDUCATIONAL: {
    READ: 'educational_read',
    CREATE: 'educational_create',
    MANAGE: 'educational_manage',
  },
  USERS: {
    READ: 'user_read',
    CREATE: 'user_create',
    UPDATE: 'user_update',
    DELETE: 'user_delete',
    MANAGE: 'user_manage',
  },
  AUDIT_LOG: {
    READ: 'audit_log_read',
  },
  AUTHENTICATION: {
    REGISTER: 'auth_register',
    LOGIN: 'auth_login',
    REFRESH_TOKEN: 'auth_refresh_token',
    ME: 'auth_me',
  },
  LOCATIONS: {
    READ: 'locations_read',
    CREATE: 'locations_create',
    UPDATE: 'locations_update',
    DELETE: 'locations_delete',
  },
  PAYMENTS: {
    READ: 'payments_read',
    CREATE: 'payments_create',
    UPDATE: 'payments_update',
    REFUND: 'payments_refund',
  },
  STATISTICS: {
    READ: 'statistics_read',
    EXPORT: 'statistics_export',
  },
  REVIEWS: {
    READ: 'reviews_read',
    CREATE: 'reviews_create',
    UPDATE: 'reviews_update',
    DELETE: 'reviews_delete',
  },
  NOTIFICATIONS: {
    READ: 'notifications_read',
    CREATE: 'notifications_create',
    SEND: 'notifications_send',
  },
  MULTIMEDIA: {
    READ: 'multimedia_read',
    UPLOAD: 'multimedia_upload',
    DELETE: 'multimedia_delete',
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
