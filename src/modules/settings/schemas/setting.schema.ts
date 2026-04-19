import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SettingDocument = HydratedDocument<Setting>;

export enum Theme {
  MODERN = 'modern',
  CLASSIC = 'classic',
}

export interface HeroSlide {
  type: string;
  badge?: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  ctaLabel?: string;
  ctaUrl?: string;
}

export interface SocialLinks {
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  address?: string;
  businessHours?: string;
}

@Schema({ timestamps: true })
export class Setting {
  @Prop({ default: 'VEAM' })
  siteName: string;

  @Prop({
    type: String,
    enum: Object.values(Theme),
    default: Theme.MODERN,
  })
  activeTheme: Theme;

  @Prop({ type: [Object], default: [] })
  heroSlides: HeroSlide[];

  @Prop({ type: Object, default: {} })
  socialLinks: SocialLinks;

  @Prop({ type: Object, default: {} })
  contactInfo: ContactInfo;
}

export const SettingSchema = SchemaFactory.createForClass(Setting);
