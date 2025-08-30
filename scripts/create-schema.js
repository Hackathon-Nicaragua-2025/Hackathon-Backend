#!/usr/bin/env node

import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

async function createSchema() {
  const client = new Client({
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    console.log('🔌 Conectando a la base de datos...');
    await client.connect();

    console.log('📋 Creando esquema "app"...');
    await client.query('CREATE SCHEMA IF NOT EXISTS app');

    console.log('🔧 Creando extensión uuid-ossp...');
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    console.log('✅ Esquema creado exitosamente!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

createSchema();
