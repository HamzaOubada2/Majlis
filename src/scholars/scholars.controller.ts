import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ScholarsService } from './scholars.service';
import { CreateScholarDto } from './dtos/create-scholar.dto';
import { UpdateScholarDto } from './dtos/update-scholar.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../enums/UserRole';

@ApiTags('Scholars')
@Controller('scholars')
export class ScholarsController {
  constructor(private readonly scholarsService: ScholarsService) {}

  @ApiOperation({ summary: 'إضافة محاضر جديد (تتطلب صلاحيات المشرف)' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() createScholarDto: CreateScholarDto) {
    return this.scholarsService.create(createScholarDto);
  }

  @ApiOperation({ summary: 'جلب قائمة المحاضرين' })
  @Get()
  findAll() {
    return this.scholarsService.findAll();
  }

  @ApiOperation({ summary: 'جلب بيانات محاضر محدد' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scholarsService.findOne(id);
  }

  @ApiOperation({ summary: 'تحديث بيانات محاضر (تتطلب صلاحيات المشرف)' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateScholarDto: UpdateScholarDto) {
    return this.scholarsService.update(id, updateScholarDto);
  }

  @ApiOperation({ summary: 'حذف محاضر (تتطلب صلاحيات المشرف)' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scholarsService.delete(id);
  }
}