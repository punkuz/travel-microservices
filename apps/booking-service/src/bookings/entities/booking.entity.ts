import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Booking {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column()
  userId: string;

  @Column()
  tourId: string;

  @Column({ type: "date" })
  bookingDate: Date;

  @Column({ type: "integer" })
  numberOfParticipants: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ type: "varchar", length: 50, default: "pending" })
  paymentStatus: string;

  @Column({ type: "varchar", length: 50, default: "pending" })
  bookingStatus: string;

  @Column({ type: "text", nullable: true })
  specialRequests: string;

  @Column({ type: "json", nullable: true })
  paymentDetails: {
    transactionId: string;
    paymentMethod: string;
    // Add other relevant payment detail
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
