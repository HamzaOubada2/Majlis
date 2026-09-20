import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ScholarsService } from './scholars.service';
import { CreateScholarDto } from './dtos/create-scholar.dto';
import { UpdateScholarDto } from './dtos/update-scholar.dto';

@ApiTags('Scholars')
@Controller('scholars')
export class ScholarsController {
  constructor(private readonly scholarsService: ScholarsService) {}

  @ApiOperation({ summary: 'إضافة محاضر جديد' })
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

  @ApiOperation({ summary: 'تحديث بيانات محاضر' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateScholarDto: UpdateScholarDto) {
    return this.scholarsService.update(id, updateScholarDto);
  }

  @ApiOperation({ summary: 'حذف محاضر' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scholarsService.delete(id);
  }
}