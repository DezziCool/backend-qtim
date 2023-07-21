import { Migration } from '@mikro-orm/migrations';

export class Migration20230720151911 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "qtim"."users" ("id" serial primary key, "email" varchar(255) not null, "password" varchar(255) not null, "refresh_tokens" text[] not null);');
    this.addSql('alter table "qtim"."users" add constraint "users_email_unique" unique ("email");');

    this.addSql('create table "qtim"."news" ("id" serial primary key, "title" varchar(255) not null, "description" varchar(255) not null, "picture" varchar(255) not null, "created_at" timestamp with time zone not null, "updated_at" timestamp with time zone not null, "author_id" int not null);');
    this.addSql('alter table "qtim"."news" add constraint "news_author_id_foreign" foreign key ("author_id") references "qtim"."users" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "qtim"."news" drop constraint "news_author_id_foreign";');

    this.addSql('drop table if exists "qtim"."users" cascade;');
    this.addSql('drop table if exists "qtim"."news" cascade;');

    this.addSql('drop schema "qtim";');
  }

}
