import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminEntity } from './admin.entity';
import { AdminDTO } from './admin.dto';
import { SellerEntity } from '../Seller/Seller.entity';
import * as bcrypt from "bcrypt";

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepo: Repository<AdminEntity>,

    @InjectRepository(SellerEntity)
    private readonly sellerRepo: Repository<SellerEntity>,
  ) {}

  // Create a new admin
  // async createAdmin(data: AdminDTO): Promise<AdminEntity> {
  //   const admin = this.adminRepo.create(data);
  //   return this.adminRepo.save(admin);
  // }

  async createAdmin(data: AdminDTO): Promise<AdminEntity>{
    const salt = await bcrypt.genSalt(); // generate salt
    const hashedPassword = await bcrypt.hash(data.password, salt); // hash with salt

    const admin = this.adminRepo.create({...data,password: hashedPassword,});

    return this.adminRepo.save(admin);
  }

  // Get all admins
  async getAllAdmins(): Promise<AdminEntity[]> {
    return this.adminRepo.find({ relations: ['approvedSellers'] });
  }

  //  Login validation with bcrypt.compare
  // async login(email: string, password: string): Promise<AdminEntity | null> {
  //   const admin = await this.adminRepo.findOne({ where: { email } });
  //   if (!admin) return null;

  //   const isMatch = await bcrypt.compare(password, admin.password); // check plain vs hash
  //   return isMatch ? admin : null;
  // }

  async login(email: string, password: string, session: any): Promise<AdminEntity | null> {
    const admin = await this.adminRepo.findOne({ where: { email } });
    if (!admin) return null;

    const isMatch = await bcrypt.compare(password, admin.password);
    if (isMatch) {
      session.adminId = admin.id;
      session.email = admin.email;
      return admin;
    }
    return null;
  }


  // Approve a seller by admin
  async approveSeller(adminId: number, sellerId: number): Promise<SellerEntity> {
    const admin = await this.adminRepo.findOne({ where: { id: adminId } });
    if (!admin) throw new NotFoundException(`Admin with ID ${adminId} not found`);

    const seller = await this.sellerRepo.findOne({ where: { id: sellerId } });
    if (!seller) throw new NotFoundException(`Seller with ID ${sellerId} not found`);

    seller.admin = admin;
    return this.sellerRepo.save(seller);
  }

  async logout(session: any): Promise<{ message: string }> {
    session.destroy();
    return { message: 'Logged out successfully' };
 }

}
