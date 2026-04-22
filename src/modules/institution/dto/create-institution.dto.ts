import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InstitutionStatus } from '../schemas/institution.schema';

export class CreateInstitutionDto {
  @ApiProperty({ example: 'Vietnam National University' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    example: 'vietnam-national-university',
    description: 'Auto-generated from title if omitted',
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiPropertyOptional({ description: 'Short summary shown in list views' })
  @IsString()
  @IsOptional()
  excerpt?: string;

  @ApiPropertyOptional({ description: 'Longer plain-text description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Full HTML content' })
  @IsString()
  @IsOptional()
  contentHtml?: string;

  @ApiPropertyOptional({ description: 'Absolute URL of cover image' })
  @IsString()
  @IsOptional()
  coverImage?: string;

  @ApiPropertyOptional({
    enum: InstitutionStatus,
    default: InstitutionStatus.DRAFT,
  })
  @IsEnum(InstitutionStatus)
  @IsOptional()
  status?: InstitutionStatus;

  @ApiPropertyOptional({
    description:
      'ISO 8601 publish date. Auto-set to now when status=published and omitted.',
    example: '2026-01-15T09:00:00.000Z',
  })
  @IsDateString()
  @IsOptional()
  publishedAt?: string;
}
