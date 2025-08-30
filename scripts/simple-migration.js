#!/usr/bin/env node

import { execSync } from 'child_process';

console.log('🔄 Ejecutando migración simple...');

try {
  // Ejecutar la migración directamente
  execSync('npx typeorm-ts-node-commonjs migration:run -d ormconfig.js', {
    stdio: 'inherit',
    timeout: 60000, // 60 segundos de timeout
  });
  
  console.log('✅ Migración ejecutada exitosamente');
} catch (error) {
  console.error('❌ Error al ejecutar la migración:', error.message);
  process.exit(1);
}
