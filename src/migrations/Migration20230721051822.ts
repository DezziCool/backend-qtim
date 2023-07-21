import { Migration } from '@mikro-orm/migrations';

export class Migration20230721051822 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "qtim"."news" alter column "picture" type varchar(255) using ("picture"::varchar(255));');
    this.addSql('alter table "qtim"."news" alter column "picture" drop not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "qtim"."news" alter column "picture" type varchar(255) using ("picture"::varchar(255));');
    this.addSql('alter table "qtim"."news" alter column "picture" set not null;');
  }

}
