#!/usr/bin/env node

import { execSync } from 'child_process';

try {
  console.log('🔄 Ejecutando migraciones...');

  const command = 'npx typeorm-ts-node-commonjs migration:run -d ormconfig.js';

  console.log(`📋 Ejecutando: ${command}`);
  execSync(command, { stdio: 'inherit' });

  console.log('✅ Migraciones ejecutadas exitosamente');
} catch (error) {
  console.error('❌ Error al ejecutar las migraciones:', error.message);
  process.exit(1);
}
