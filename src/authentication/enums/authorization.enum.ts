export enum ModuleName {
  AUDIT_LOG = 'Audit Log',
  AUTHENTICATION = 'Authentication',
  QUERY = 'Query',
  QUERY_RECOMMENDATION = 'Query Recommendation',
  SERVER_CONFIGURATION = 'Server Configuration',
  TABLE = 'Table',
  TABLE_RECOMMENDATION = 'Table Recommendation',
  INDEX = 'Index',
  DOMAIN = 'Domain',
  APPLICATION = 'Application',
}

// Strongly typed structure for PermissionActions
export const PermissionActions = {
  AUDIT_LOG: {
    READ: 'audit_log_read',
  },
  AUTHENTICATION: {
    REGISTER: 'auth_register',
    LOGIN: 'auth_login',
    REFRESH_TOKEN: 'auth_refresh_token',
    ME: 'auth_me',
  },
  QUERY: {
    READ: 'query_read',
    CREATE: 'query_create',
    UPDATE: 'query_update',
    DELETE: 'query_delete',
  },
  QUERY_RECOMMENDATION: {
    READ: 'query_recommendation_read',
    CREATE: 'query_recommendation_create',
    UPDATE: 'query_recommendation_update',
    DELETE: 'query_recommendation_delete',
    UNLINK: 'query_recommendation_unlink',
  },
  SERVER_CONFIGURATION: {
    CREATE: 'server_configuration_create',
    READ: 'server_configuration_read',
    UPDATE: 'server_configuration_update',
    DELETE: 'server_configuration_delete',
    SEARCH: 'server_configuration_search',
    RESTORE: 'server_configuration_restore',
  },
  TABLE: {
    READ: 'table_read',
    CREATE: 'table_create',
    UPDATE: 'table_update',
    DELETE: 'table_delete',
  },
  TABLE_RECOMMENDATION: {
    READ: 'table_recommendation_read',
    CREATE: 'table_recommendation_create',
    UPDATE: 'table_recommendation_update',
    DELETE: 'table_recommendation_delete',
    UNLINK: 'table_recommendation_unlink',
  },
  INDEX: {
    READ: 'index_read',
    CREATE: 'index_create',
    UPDATE: 'index_update',
    DELETE: 'index_delete',
  },
  DOMAIN: {
    READ: 'domain_read',
    CREATE: 'domain_create',
    UPDATE: 'domain_update',
    DELETE: 'domain_delete',
  },
  APPLICATION: {
    READ: 'application_read',
    CREATE: 'application_create',
    UPDATE: 'application_update',
    DELETE: 'application_delete',
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
