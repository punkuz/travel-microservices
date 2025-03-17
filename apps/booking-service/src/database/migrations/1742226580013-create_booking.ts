import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBooking1742226580013 implements MigrationInterface {
    name = 'CreateBooking1742226580013'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`booking\` (\`id\` varchar(36) NOT NULL, \`userId\` varchar(255) NOT NULL, \`tourId\` varchar(255) NOT NULL, \`bookingDate\` date NOT NULL, \`numberOfParticipants\` int NOT NULL, \`totalPrice\` decimal(10,2) NOT NULL, \`paymentStatus\` varchar(50) NOT NULL DEFAULT 'pending', \`bookingStatus\` varchar(50) NOT NULL DEFAULT 'pending', \`specialRequests\` text NULL, \`paymentDetails\` json NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`booking\``);
    }

}
