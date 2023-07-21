import { Options } from '@mikro-orm/core';
import { ConfigService } from '@nestjs/config';
import { NewsEntity, UserEntity } from './entities';

const configService = new ConfigService();

const MikroOrmConfig: Options = {
  entities: [
    UserEntity, NewsEntity
  ],
  type: 'postgresql',
  schema: 'qtim',
  clientUrl: configService.get('POSTGRES_URL'),
  migrations: {
    tableName: 'mikro_orm_migrations',
    path: './dist/migrations',
    pathTs: './src/migrations',
  },
};
export default MikroOrmConfig;
