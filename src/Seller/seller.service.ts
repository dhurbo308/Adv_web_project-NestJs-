import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { SellerEntity } from './Seller.entity';
import { SellerDTO } from './seller.dto';

@Injectable()
export class SellerService {
  constructor(
    @InjectRepository(SellerEntity) private readonly sellerRepo: Repository<SellerEntity>,) {}

  getProfile(): string {
    return 'Seller Profile Page';
  }

  async createSeller(data: SellerDTO): Promise<SellerEntity> {
    //const seller = this.sellerRepo.create(data);
    return this.sellerRepo.save(data);
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
}
