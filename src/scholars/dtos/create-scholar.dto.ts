import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateScholarDto {
  @ApiProperty({ example: 'د. سعيد الكملي', description: 'اسم المحاضر' })
  @IsString()
  @IsNotEmpty({ message: 'اسم المحاضر مطلوب' })
  name: string;

  @ApiPropertyOptional({ example: 'دكتوراه في الفقه والأصول', description: 'السيرة الذاتية' })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiPropertyOptional({ example: 'الفقه الإسلامي', description: 'التخصص العلمي' })
  @IsString()
  @IsOptional()
  specialization?: string;
}