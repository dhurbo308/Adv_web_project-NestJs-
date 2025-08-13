import { Module } from "@nestjs/common";
import { SellerController } from "./seller.controller";
import { SellerService } from "./seller.service";
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellerEntity } from './Seller.entity';
import { AdminEntity } from "src/Admin/admin.entity";

@Module({
  imports:[TypeOrmModule.forFeature([SellerEntity,AdminEntity])],
  controllers: [SellerController],
  providers: [SellerService],
})
export class SellerModule {}
