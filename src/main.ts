import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MikroORM } from '@mikro-orm/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const orm = app.get(MikroORM);
  // const migrator = orm.getMigrator();

  // migrator.up();
  await app.listen(3000);
}
bootstrap();
