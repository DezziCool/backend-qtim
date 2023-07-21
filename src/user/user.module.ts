import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { UserEntity } from "src/entities";
import { UserService } from "./user.service";

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [UserEntity] })],
  exports: [UserService],
  providers: [UserService],
})
export class UserModule { }