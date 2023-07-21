import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { UserEntity } from './user.entity';

@Entity({
  tableName: 'news',
})
export class NewsEntity {
  @PrimaryKey()
  id: number;

  @Property()
  title: string;

  @Property()
  description: string;

  @Property({ nullable: true })
  picture?: string;

  @Property({ columnType: 'timestamp with time zone' })
  createdAt = new Date();

  @Property({
    onUpdate: () => new Date(),
    columnType: 'timestamp with time zone',
  })
  updatedAt = new Date();

  @ManyToOne('UserEntity')
  author: UserEntity;
}
