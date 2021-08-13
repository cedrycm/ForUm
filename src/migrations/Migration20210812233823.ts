import { Migration } from '@mikro-orm/migrations';

export class Migration20210812233823 extends Migration {

  async up(): Promise<void> {
    this.addSql('drop table if exists "user" cascade;');
  }

}
