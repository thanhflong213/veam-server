import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsNotEmpty,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Theme } from '../schemas/setting.schema';

export class NavItemLeafDto {
  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  label: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  href?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  enabled?: boolean;
}

export class NavItemSubDto {
  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  label: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  href?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  enabled?: boolean;

  @ApiPropertyOptional({ type: [NavItemLeafDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NavItemLeafDto)
  @IsOptional()
  children?: NavItemLeafDto[];
}

export class NavItemDto {
  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  label: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  href?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  enabled?: boolean;

  @ApiPropertyOptional({ type: [NavItemSubDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NavItemSubDto)
  @IsOptional()
  children?: NavItemSubDto[];
}

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

export class ConferenceInfoDto {
  @ApiPropertyOptional({ example: 'July 13–14, 2026' })
  @IsString()
  @IsOptional()
  date?: string;

  @ApiPropertyOptional({ example: 'Hue, Vietnam' })
  @IsString()
  @IsOptional()
  location?: string;
}

export class ImportantDateDto {
  @ApiPropertyOptional({ example: 'May 31, 2026' })
  @IsString()
  @IsNotEmpty()
  date: string;

  @ApiPropertyOptional({ example: 'Paper Submission Deadline' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: '5:00 PM Hanoi time (GMT+7)' })
  @IsString()
  @IsOptional()
  description?: string;
}

export class KeynoteDto {
  @ApiPropertyOptional({ example: 'Prof. Philippe Aghion' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'London School of Economics' })
  @IsString()
  @IsNotEmpty()
  institution: string;

  @ApiPropertyOptional({ example: 'Innovation & Growth Economics' })
  @IsString()
  @IsNotEmpty()
  topic: string;

  @ApiPropertyOptional({ description: 'Absolute URL of speaker photo' })
  @IsString()
  @IsOptional()
  avatarUrl?: string;
}

export class SpecialSessionDto {
  @ApiPropertyOptional({ example: 'Behavioral Economics and Environment' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'Chair: Khanh-Nam Pham, UEH, Vietnam' })
  @IsString()
  @IsNotEmpty()
  chair: string;
}

export class PublicationDto {
  @ApiPropertyOptional({ example: "Revue d'Économie du Développement" })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'ISVE–VEAM Special Issue' })
  @IsString()
  @IsOptional()
  description?: string;
}

export class OrganizingInstitutionDto {
  @ApiPropertyOptional({ example: 'University of Economics – Hue University' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Host Institution' })
  @IsString()
  @IsNotEmpty()
  role: string;

  @ApiPropertyOptional({ description: 'Absolute URL of institution logo' })
  @IsString()
  @IsOptional()
  logoUrl?: string;
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

  @ApiPropertyOptional({ type: [NavItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NavItemDto)
  @IsOptional()
  navItems?: NavItemDto[];

  @ApiPropertyOptional({ type: [String], description: 'Announcement IDs to feature in sidebar' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  featuredAnnouncements?: string[];

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

  @ApiPropertyOptional({ type: ConferenceInfoDto })
  @ValidateNested()
  @Type(() => ConferenceInfoDto)
  @IsOptional()
  conferenceInfo?: ConferenceInfoDto;

  @ApiPropertyOptional({ type: [ImportantDateDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImportantDateDto)
  @IsOptional()
  importantDates?: ImportantDateDto[];

  @ApiPropertyOptional({ type: [KeynoteDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => KeynoteDto)
  @IsOptional()
  keynotes?: KeynoteDto[];

  @ApiPropertyOptional({ type: [SpecialSessionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SpecialSessionDto)
  @IsOptional()
  specialSessions?: SpecialSessionDto[];

  @ApiPropertyOptional({ type: [PublicationDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PublicationDto)
  @IsOptional()
  publications?: PublicationDto[];

  @ApiPropertyOptional({ type: [OrganizingInstitutionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrganizingInstitutionDto)
  @IsOptional()
  organizingInstitutions?: OrganizingInstitutionDto[];
}
