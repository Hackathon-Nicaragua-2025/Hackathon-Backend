import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { SeedService } from './src/seed/seed.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  try {
    console.log('🌱 Iniciando proceso de seed...');
    
    const seedService = app.get(SeedService);
    await seedService.seed();
    
    console.log('✅ Seed completado exitosamente!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

bootstrap();
