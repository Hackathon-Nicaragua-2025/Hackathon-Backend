#!/usr/bin/env node

import { execSync } from 'child_process';
import path from 'path';

// Obtener el nombre de la migración desde los argumentos
const migrationName = process.argv[2];

if (!migrationName) {
  console.error('❌ Error: Debes proporcionar un nombre para la migración');
  console.log('📝 Uso: node scripts/generate-migration.js NombreMigracion');
  console.log('📝 Ejemplo: node scripts/generate-migration.js InitialSchema');
  process.exit(1);
}

try {
  console.log(`🔄 Generando migración: ${migrationName}`);
  
  const command = `npx typeorm-ts-node-commonjs migration:generate src/database/migrations/${migrationName} -d ormconfig.js`;
  
  console.log(`📋 Ejecutando: ${command}`);
  execSync(command, { stdio: 'inherit' });
  
  console.log(`✅ Migración generada exitosamente: ${migrationName}`);
  console.log(`📁 Ubicación: src/database/migrations/`);
  
} catch (error) {
  console.error('❌ Error al generar la migración:', error.message);
  process.exit(1);
}
