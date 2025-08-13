import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from './admin.entity';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { SellerEntity } from '../Seller/Seller.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AdminEntity, SellerEntity]),],
  controllers: [AdminController],
  providers: [AdminService],
  //exports: [AdminService],
})
export class AdminModule {}
