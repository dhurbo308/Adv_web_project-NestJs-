import { Entity, PrimaryGeneratedColumn, Column,ManyToOne } from "typeorm";
import { AdminEntity } from "src/Admin/admin.entity";

@Entity("sellers")
export class SellerEntity {
  password(password: string, password1: any) {
    throw new Error('Method not implemented.');
  }
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
  
  @ManyToOne(() => AdminEntity, admin => admin.approvedSellers, { nullable: true })
  admin: AdminEntity;

    
}
