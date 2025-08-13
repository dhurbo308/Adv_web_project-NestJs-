import { Controller, Post, Get, Param, Body, ParseIntPipe, UsePipes, ValidationPipe } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminDTO } from './admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Create a new admin
  @Post('create')
  @UsePipes(new ValidationPipe())
  async createAdmin(@Body() data: AdminDTO) {
    return this.adminService.createAdmin(data);
  }

  // Get all admins with their approved sellers
  @Get('all')
  async getAllAdmins() {
    return this.adminService.getAllAdmins();
  }

  // Approve a seller
  @Post(':adminId/approve/:sellerId')
  async approveSeller(
    @Param('adminId', ParseIntPipe) adminId: number,
    @Param('sellerId', ParseIntPipe) sellerId: number
  ) {
    return this.adminService.approveSeller(adminId, sellerId);
  }
}
