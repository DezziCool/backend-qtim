import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { NewsEntity } from "src/entities";
import { NewsController } from "./news.controller";
import { NewsService } from "./news.service";
import { UserModule } from "src/user/user.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    UserModule,
    JwtModule,
    MikroOrmModule.forFeature({ entities: [NewsEntity] })
  ],
  controllers: [NewsController],
  providers: [NewsService],
})
export class NewsModule { }