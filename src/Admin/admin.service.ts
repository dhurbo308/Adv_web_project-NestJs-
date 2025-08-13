import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminEntity } from './admin.entity';
import { AdminDTO } from './admin.dto';
import { SellerEntity } from '../Seller/Seller.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepo: Repository<AdminEntity>,

    @InjectRepository(SellerEntity)
    private readonly sellerRepo: Repository<SellerEntity>,
  ) {}

  // Create a new admin
  async createAdmin(data: AdminDTO): Promise<AdminEntity> {
    const admin = this.adminRepo.create(data);
    return this.adminRepo.save(admin);
  }

  // Get all admins
  async getAllAdmins(): Promise<AdminEntity[]> {
    return this.adminRepo.find({ relations: ['approvedSellers'] });
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
}
