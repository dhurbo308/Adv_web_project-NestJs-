import {Controller, Post, Get, Patch, Param, Body, UploadedFile, UseInterceptors, UsePipes, ValidationPipe, ParseIntPipe,Delete,Put, Session, NotFoundException, ForbiddenException, Req} from '@nestjs/common';
import { SellerService } from './seller.service';
import { SellerDTO } from './seller.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, MulterError } from 'multer';


@Controller('seller')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @Get('profile/:id')
  async getProfile(@Param('id', ParseIntPipe) id: number) {
    return this.sellerService.getProfile(id);
  }

   @Get('me')
    async getMyProfile(@Session() session: Record<string, any>) {
    const sellerId = session.sellerId;
    if (!sellerId) throw new NotFoundException("Seller is not logged in");
    return this.sellerService.getProfile(sellerId);
  }

  @Post('create')
  @UsePipes(new ValidationPipe())
  async createSeller(@Body() data: SellerDTO) {
    return this.sellerService.createSeller(data);
  }
  @Post("login")
  async login(
  @Body() body: { email: string; },
  @Session() session: Record<string, any>
) {
  const seller = await this.sellerService.login(body.email,  session);
  if (!seller) {
    return { message: "Invalid credentials" };
  }
  return { message: "Login successful", seller };
}

 @Post("logout")
  async logout(@Session() session: Record<string, any>) {
    return this.sellerService.logout(session);
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

  @Delete('delete/:id')
  async deleteSeller(@Param('id', ParseIntPipe) id: number) {
    return this.sellerService.deleteSellerById(id);
  }

  @Put('updateseller/:id')
  @UsePipes(new ValidationPipe({ skipMissingProperties: true }))//skipMissingProperties: true validation pipe means it won't complaine about missing filds.
  async updateSeller(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: Partial<SellerDTO>
  ) {
    return this.sellerService.updateSeller(id, updateData);
  }
// @Put("updateseller/:id")
// async updateSeller(@Param("id") id: number, @Body() dto: SellerDTO, @Req() req) {
//   const loggedInSellerId = req.session?.seller?.id; // if using session
//   if (loggedInSellerId !== id) {
//     throw new ForbiddenException("You can only edit your own profile");
//   }
//   return this.sellerService.updateSeller(id, dto);
// }



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
      limits: { fileSize: 5000000 },
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
