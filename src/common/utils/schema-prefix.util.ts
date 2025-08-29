// utils/schema-prefix.util.ts
export function getSchemaName(baseSchema: string): string {
  const prefix = process.env.DB_PREFIX || '';
  const schemaName = `${prefix}${baseSchema}`;
  return schemaName;
}
