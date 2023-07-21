import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { UserEntity, NewsEntity } from './entities';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { NewsModule } from './news/news.module';
import { JwtModule } from '@nestjs/jwt';

const entities = [UserEntity, NewsEntity];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        POSTGRES_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
      }),
    }),
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgresql',
        autoLoadEntities: true,
        schema: 'qtim',
        migrations: {
          tableName: 'mikro_orm_migrations',
          path: './dist/migrations',
          pathTs: './src/migrations',
          disableForeignKeys: false,
        },
        clientUrl: configService.get('POSTGRES_URL'),
      }),
    }),
    MikroOrmModule.forFeature({ entities }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          global: true,
          secret: configService.get('JWT_SECRET')!,
        }
      }
    }),
    AuthModule,
    UserModule,
    NewsModule,
  ]
})
export class AppModule { }
