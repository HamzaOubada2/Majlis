import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../enums/UserRole';

@ApiTags('Admin')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({ summary: 'إحصائيات لوحة التحكم' })
  @Get('overview')
  getOverview() {
    return this.adminService.getOverview();
  }

  @ApiOperation({ summary: 'جلب جميع الحجوزات والحاضرين' })
  @ApiQuery({ name: 'seminarId', required: false, description: 'فلترة الحجوزات حسب الندوة' })
  @Get('reservations')
  findAllReservations(@Query('seminarId') seminarId?: string) {
    return this.adminService.findAllReservations(seminarId);
  }
}