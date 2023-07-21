import { Collection, Entity, OneToMany, PrimaryKey, Property, Unique } from "@mikro-orm/core";
import { NewsEntity } from "./news.entity";

@Entity({
  tableName: 'users',
})
export class UserEntity {
  @PrimaryKey()
  id: number;

  @Property()
  @Unique()
  email: string;

  @Property()
  password: string;

  @Property({ type: 'array' })
  refreshTokens: string[];

  @OneToMany('NewsEntity', 'author')
  news = new Collection<NewsEntity>(this);
}
