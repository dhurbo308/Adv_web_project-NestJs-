import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { SellerEntity } from './Seller.entity';
import { SellerDTO } from './seller.dto';
import { AdminEntity } from 'src/Admin/admin.entity';



@Injectable()
export class SellerService {
  pusherService: any;
 
  constructor(
    @InjectRepository(SellerEntity) private readonly sellerRepo: Repository<SellerEntity>,
    @InjectRepository(AdminEntity)private readonly adminRepo: Repository<AdminEntity>,) {}

  async getProfile(id: number):Promise<SellerEntity | null> {
    return this.sellerRepo.findOneBy({id});
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
    
    // Notify admins in real-time
    // await this.pusherService.trigger("admins", "new-seller", {
    //   sellerId: seller.id,
    //   email: seller.email,
    //   message: `New seller registered: ${seller.email}`,
    // });
    return this.sellerRepo.save(seller);
  }

async login(email: string,  session: any): Promise<SellerEntity | null> {
  const seller = await this.sellerRepo.findOne({ where: { email } });
  if (!seller) return null;

  
 
    session.sellerId = seller.id;
    session.email = seller.email;
    return seller;
}

async logout(session: any): Promise<{ message: string }> {
    session.destroy();
    return { message: 'Logged out successfully' };
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

    await this.sellerRepo.delete(id);
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
