import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SeminarsService } from './seminars.service';
import { CreateSeminarDto } from './dtos/create-seminar.dto';
import { UpdateSeminarDto } from './dtos/update-seminar.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UpdateScholarDto } from '../scholars/dtos/update-scholar.dto';

@ApiTags('Seminars')
@Controller('seminars')
export class SeminarsController {
  constructor(private readonly seminarsService: SeminarsService) {}

  @ApiOperation({ summary: 'إضافة ندوة جديدة (تتطلب توثيق)' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
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

  @ApiOperation({ summary: 'تحديث بيانات ندوة (تتطلب توثيق)' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSeminarDto: UpdateSeminarDto) {
    return this.seminarsService.update(id, UpdateScholarDto as any);
  }

  @ApiOperation({ summary: 'حذف ندوة (تتطلب توثيق)' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.seminarsService.remove(id);
  }
}