import {Controller, Post, Get, Patch, Param, Body, UploadedFile, UseInterceptors, UsePipes, ValidationPipe, ParseIntPipe,} from '@nestjs/common';
import { SellerService } from './seller.service';
import { SellerDTO } from './seller.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, MulterError } from 'multer';

@Controller('seller')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @Get('profile')
  getProfile(): string {
    return this.sellerService.getProfile();
  }

  @Post('create')
  @UsePipes(new ValidationPipe())
  async createSeller(@Body() data: SellerDTO) {
    return this.sellerService.createSeller(data);
  }

  @Patch('status/:id')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: string,
  ) {
    return this.sellerService.updateSellerStatus(id, status);
  }

  @Get('inactive')
  async getInactiveSellers() {
    return this.sellerService.findInactiveSellers();
  }

  @Get('older')
  async getSellersOlderThan40() {
    return this.sellerService.findSellersOlderThan40();
  }

  @Post('uploadfile')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, cb) => {
        if (file.originalname.match(/^.*\.(jpg|jpeg|png|pdf)$/)) {
          cb(null, true);
        } else {
          cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'file'), false);
        }
      },
      limits: { fileSize: 2000000 },
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, Date.now() + '-' + file.originalname);
        },
      }),
    }),
  )
  uploadNID(@UploadedFile() file: Express.Multer.File) {
    return {
      message: 'NID uploaded successfully',
      file,
    };
  }
}
