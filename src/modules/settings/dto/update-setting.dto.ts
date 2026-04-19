import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Theme } from '../schemas/setting.schema';

export class HeroSlideDto {
  @ApiPropertyOptional({ enum: ['text', 'image'], example: 'text' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiPropertyOptional({ example: 'VEAM 2026' })
  @IsString()
  @IsOptional()
  badge?: string;

  @ApiPropertyOptional({ example: 'Vietnam Economists Annual Meeting' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  subtitle?: string;

  @ApiPropertyOptional({ description: 'Absolute image URL (image slides only)' })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiPropertyOptional({ example: 'Register Now' })
  @IsString()
  @IsOptional()
  ctaLabel?: string;

  @ApiPropertyOptional({ example: '/registration' })
  @IsString()
  @IsOptional()
  ctaUrl?: string;
}

export class SocialLinksDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  facebook?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  twitter?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  linkedin?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  youtube?: string;
}

export class ContactInfoDto {
  @ApiPropertyOptional({ example: 'veam@depocen.org' })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: '(84 24) 39351419' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ example: '8:00 AM – 6:00 PM' })
  @IsString()
  @IsOptional()
  businessHours?: string;
}

export class UpdateSettingDto {
  @ApiPropertyOptional({ example: 'VEAM 2026' })
  @IsString()
  @IsOptional()
  siteName?: string;

  @ApiPropertyOptional({ enum: Theme, default: Theme.MODERN })
  @IsEnum(Theme)
  @IsOptional()
  activeTheme?: Theme;

  @ApiPropertyOptional({ type: [HeroSlideDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HeroSlideDto)
  @IsOptional()
  heroSlides?: HeroSlideDto[];

  @ApiPropertyOptional({ type: SocialLinksDto })
  @ValidateNested()
  @Type(() => SocialLinksDto)
  @IsOptional()
  socialLinks?: SocialLinksDto;

  @ApiPropertyOptional({ type: ContactInfoDto })
  @ValidateNested()
  @Type(() => ContactInfoDto)
  @IsOptional()
  contactInfo?: ContactInfoDto;
}
