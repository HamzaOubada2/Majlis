import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsDateString, IsInt, Min, IsUUID, IsOptional } from 'class-validator';

export class CreateSeminarDto {
  @ApiProperty({ example: 'شرح كتاب التوحيد', description: 'عنوان الندوة' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'سلسلة درس أسبوعي في العقيدة', description: 'وصف الندوة' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '2026-10-15T18:00:00Z', description: 'تاريخ ووقت الندوة' })
  @IsDateString()
  eventDate: string;

  @ApiProperty({ example: 'المسجد الكبير - أكادير', description: 'مكان إقامة الندوة' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ example: 100, description: 'إجمالي السعة الاستيعابية للمقاعد' })
  @IsInt()
  @Min(1)
  capacity: number;

  @ApiPropertyOptional({ example: 'uuid-scholar-id-here', description: 'معرف المحاضر' })
  @IsUUID()
  @IsOptional()
  scholarId?: string | null;
}