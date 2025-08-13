import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SellerModule } from './Seller/seller.module';
// import { CustomerModule } from './Customer/customer.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from './Admin/admin.module';
@Module({
  imports: [AdminModule,SellerModule, TypeOrmModule.forRoot(
{ 
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'root',
  database: 'NestJsProject',
  autoLoadEntities: true,
  synchronize: true,
} ),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
