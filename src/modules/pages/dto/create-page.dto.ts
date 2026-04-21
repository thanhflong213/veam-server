import { IsString, IsNotEmpty, IsOptional, IsEnum, IsMongoId, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PageStatus } from '../schemas/page.schema';

export class CreatePageDto {
  @ApiProperty({
    example: 'about',
    description: 'URL-safe slug — auto-normalised on save',
  })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 'About Us' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ description: 'Full HTML content of the page' })
  @IsString()
  @IsOptional()
  contentHtml?: string;

  @ApiPropertyOptional({ example: 'About VEAM | Vietnam Economists Annual Meeting' })
  @IsString()
  @IsOptional()
  seoTitle?: string;

  @ApiPropertyOptional({ example: 'Learn about VEAM, the annual meeting for economists.' })
  @IsString()
  @IsOptional()
  seoDescription?: string;

  @ApiPropertyOptional({ enum: PageStatus, default: PageStatus.DRAFT })
  @IsEnum(PageStatus)
  @IsOptional()
  status?: PageStatus;

  @ApiPropertyOptional({ description: 'Parent page ObjectId. Omit for root-level pages.' })
  @IsMongoId()
  @IsOptional()
  parent?: string;

  @ApiPropertyOptional({
    description: 'When true the nav item is visible but not clickable — used for group headers that only exist to nest child pages.',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  disabled?: boolean;
}
