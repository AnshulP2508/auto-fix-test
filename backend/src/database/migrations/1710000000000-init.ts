import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1710000000000 implements MigrationInterface {
  name = 'Init1710000000000';
  async up(_queryRunner: QueryRunner): Promise<void> {}
  async down(_queryRunner: QueryRunner): Promise<void> {}
}
