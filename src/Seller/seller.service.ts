import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { SellerEntity } from './Seller.entity';
import { SellerDTO } from './seller.dto';
import { AdminEntity } from 'src/Admin/admin.entity';

@Injectable()
export class SellerService {
  constructor(
    @InjectRepository(SellerEntity) private readonly sellerRepo: Repository<SellerEntity>,
    @InjectRepository(AdminEntity)private readonly adminRepo: Repository<AdminEntity>,) {}

  getProfile(): string {
    return 'Seller Profile Page';
  }

  // async createSeller(data: SellerDTO): Promise<SellerEntity> {
  //   //const seller = this.sellerRepo.create(data);
  //   return this.sellerRepo.save(data);
  // }
  
  async createSeller(data: SellerDTO): Promise<SellerEntity> {
    const seller = this.sellerRepo.create(data);

    if (data.adminId) {
       const admin = await this.adminRepo.findOne({ where: { id: data.adminId } });
      if (!admin) throw new NotFoundException(`Admin with ID ${data.adminId} not found`);
      seller.admin = admin;
    }

    return this.sellerRepo.save(seller);
  }

  async updateSellerStatus(id: number, status: string): Promise<SellerEntity> {
    const seller = await this.sellerRepo.findOneBy({ id });
    if (!seller) {
      throw new NotFoundException(`Seller with ID ${id} not found`);
    }

    seller.status = status;
    return this.sellerRepo.save(seller);
  }

  async findInactiveSellers(): Promise<SellerEntity[]> {
    return this.sellerRepo.find({ where: { status: 'inactive' } });
  }

  async findSellersOlderThan40(): Promise<SellerEntity[]> {
    return this.sellerRepo.find({
      where: {
        age: MoreThanOrEqual(40),
      },
    });
  }

  async deleteSellerById(id: number): Promise<{ message: string }> {
    const seller = await this.sellerRepo.findOneBy({ id });
    if (!seller) {
      throw new NotFoundException(`Seller with ID ${id} not found`);
    }

    await this.sellerRepo.delete(seller);
    return { message: `Seller with ID ${id} deleted successfully` };
  }

  // async updateSeller(id: number, updateData: Partial<SellerDTO>): Promise<SellerEntity> {
  //   const seller = await this.sellerRepo.findOneBy({ id });
  //   if (!seller) {
  //     throw new NotFoundException(`Seller with ID ${id} not found`);
  //   }

  //   this.sellerRepo.merge(seller, updateData);
  //   return this.sellerRepo.save(seller);
  // }

  async updateSeller(id: number, updateData: Partial<SellerDTO>): Promise<SellerEntity> {
    const seller = await this.sellerRepo.findOne({ where: { id } });
    if (!seller) throw new NotFoundException(`Seller with ID ${id} not found`);

    if (updateData.adminId) {
      const admin = await this.adminRepo.findOne({ where: { id: updateData.adminId } });
      if (!admin) throw new NotFoundException(`Admin with ID ${updateData.adminId} not found`);
      seller.admin = admin;
    }

    this.sellerRepo.merge(seller, updateData);
    return this.sellerRepo.save(seller);
  }


}
