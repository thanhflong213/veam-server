import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDateString,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AnnouncementStatus } from '../schemas/announcement.schema';

export class CreateAnnouncementDto {
  @ApiProperty({ example: 'Call for Papers: VEAM 2026' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    example: 'call-for-papers-veam-2026',
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

  @ApiPropertyOptional({ enum: AnnouncementStatus, default: AnnouncementStatus.DRAFT })
  @IsEnum(AnnouncementStatus)
  @IsOptional()
  status?: AnnouncementStatus;

  @ApiPropertyOptional({
    description: 'ISO 8601 publish date. Auto-set to now when status=published and omitted.',
    example: '2026-01-15T09:00:00.000Z',
  })
  @IsDateString()
  @IsOptional()
  publishedAt?: string;

  @ApiPropertyOptional({ default: false, description: 'Show on client when true' })
  @IsBoolean()
  @IsOptional()
  recommend?: boolean;
}
