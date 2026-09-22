import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SeminarsService } from './seminars.service';
import { CreateSeminarDto } from './dtos/create-seminar.dto';
import { UpdateSeminarDto } from './dtos/update-seminar.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../enums/UserRole';

@ApiTags('Seminars')
@Controller('seminars')
export class SeminarsController {
  constructor(private readonly seminarsService: SeminarsService) {}

  @ApiOperation({ summary: 'إضافة ندوة جديدة (تتطلب صلاحيات المشرف)' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() createSeminarDto: CreateSeminarDto) {
    return this.seminarsService.create(createSeminarDto);
  }

  @ApiOperation({ summary: 'عرض كل الندوات المتاحة مع بيانات المحاضر' })
  @Get()
  findAll() {
    return this.seminarsService.findAll();
  }

  @ApiOperation({ summary: 'عرض تفاصيل ندوة محددة' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.seminarsService.findOne(id);
  }

  @ApiOperation({ summary: 'تحديث بيانات ندوة (تتطلب صلاحيات المشرف)' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSeminarDto: UpdateSeminarDto) {
    return this.seminarsService.update(id, updateSeminarDto);
  }

  @ApiOperation({ summary: 'حذف ندوة (تتطلب صلاحيات المشرف)' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.seminarsService.remove(id);
  }
}