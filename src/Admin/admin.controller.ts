import { Controller, Post, Get, Param, Body, ParseIntPipe, UsePipes, ValidationPipe, UseGuards, Session } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminDTO } from './admin.dto';
import { SessionGuard } from 'src/auth/session.guard';

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
  @UseGuards(SessionGuard)
  async getAllAdmins() {
    return this.adminService.getAllAdmins();
  }

  // @Post("login")
  // async login(@Body() body: { email: string; password: string }) {
  //   const admin = await this.adminService.login(body.email, body.password);
  //   if (!admin) {
  //     return { message: "Invalid credentials" };
  //   }
  //   return { message: "Login successful", admin };
  // }

  @Post("login")
  async login(@Body() body: { email: string; password: string }, @Session() session: Record<string, any>) {
    const admin = await this.adminService.login(body.email, body.password, session);
    if (!admin) {
      return { message: "Invalid credentials" };
    }
    return { message: "Login successful", admin };
  }
  // Approve a seller
  @Post(':adminId/approve/:sellerId')
   @UseGuards(SessionGuard)
  async approveSeller(
    @Param('adminId', ParseIntPipe) adminId: number,
    @Param('sellerId', ParseIntPipe) sellerId: number
  ) {
    return this.adminService.approveSeller(adminId, sellerId);
  }

  @Post("logout")
  async logout(@Session() session: Record<string, any>) {
    return this.adminService.logout(session);
  }
}
