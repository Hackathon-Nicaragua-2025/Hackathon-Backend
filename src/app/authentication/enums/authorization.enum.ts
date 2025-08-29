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
