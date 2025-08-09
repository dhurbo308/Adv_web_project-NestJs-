import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("sellers")
export class SellerEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ length: 100 })
  fullName: string;

  @Column()
  email: string;

  @Column()
  nid: string;

  @Column({ unsigned: true })
  age: number;

  @Column({ default: "active" })
  status: string;
    
}
