import { MigrationInterface, QueryRunner } from 'typeorm'

export class userWalletTransactionMigration1651567096457
    implements MigrationInterface
{
    name = 'userWalletTransactionMigration1651567096457'

    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "users" (
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "email" text NOT NULL,
                "name" text NOT NULL,
                "deletedAt" TIMESTAMP,
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `)
        await queryRunner.query(`
            CREATE TABLE "wallets" (
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "incoming" double precision NOT NULL DEFAULT '0',
                "outgoing" double precision NOT NULL DEFAULT '0',
                "ownerId" uuid NOT NULL,
                "isClosed" boolean NOT NULL DEFAULT false,
                "isLock" boolean NOT NULL DEFAULT false,
                CONSTRAINT "CHK_4f9cec2d6c638c9b8197718b71" CHECK ("incoming" >= "outgoing"),
                CONSTRAINT "PK_8402e5df5a30a229380e83e4f7e" PRIMARY KEY ("id")
            )
        `)
        await queryRunner.query(`
            CREATE TYPE "public"."transactions_type_enum" AS ENUM('deposit', 'withdraw', 'transaction')
        `)
        await queryRunner.query(`
            CREATE TABLE "transactions" (
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "walletId" uuid NOT NULL,
                "money" double precision NOT NULL,
                "type" "public"."transactions_type_enum" NOT NULL,
                "toWalletId" uuid,
                CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id")
            )
        `)
        await queryRunner.query(`
            ALTER TABLE "wallets"
            ADD CONSTRAINT "FK_342cecf691b0d12172e69b2b8f9" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `)
        await queryRunner.query(`
            ALTER TABLE "transactions"
            ADD CONSTRAINT "FK_a88f466d39796d3081cf96e1b66" FOREIGN KEY ("walletId") REFERENCES "wallets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `)
        await queryRunner.query(`
            ALTER TABLE "transactions"
            ADD CONSTRAINT "FK_8ae6618f9e901745e70f8828ec8" FOREIGN KEY ("toWalletId") REFERENCES "wallets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `)
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "transactions" DROP CONSTRAINT "FK_8ae6618f9e901745e70f8828ec8"
        `)
        await queryRunner.query(`
            ALTER TABLE "transactions" DROP CONSTRAINT "FK_a88f466d39796d3081cf96e1b66"
        `)
        await queryRunner.query(`
            ALTER TABLE "wallets" DROP CONSTRAINT "FK_342cecf691b0d12172e69b2b8f9"
        `)
        await queryRunner.query(`
            DROP TABLE "transactions"
        `)
        await queryRunner.query(`
            DROP TYPE "public"."transactions_type_enum"
        `)
        await queryRunner.query(`
            DROP TABLE "wallets"
        `)
        await queryRunner.query(`
            DROP TABLE "users"
        `)
    }
}
