import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { SellerEntity } from '../Seller/Seller.entity';

@Entity('admins')
export class AdminEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  // One Admin can approve many Sellers
  @OneToMany(() => SellerEntity, seller => seller.admin)
  approvedSellers: SellerEntity[];
}
