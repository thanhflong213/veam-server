import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AnnouncementDocument = HydratedDocument<Announcement>;

export enum AnnouncementStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

@Schema({ timestamps: true })
export class Announcement {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  slug: string;

  @Prop({ default: '' })
  excerpt: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ default: '' })
  contentHtml: string;

  @Prop({ default: '' })
  coverImage: string;

  @Prop({
    type: String,
    enum: Object.values(AnnouncementStatus),
    default: AnnouncementStatus.DRAFT,
  })
  status: AnnouncementStatus;

  @Prop({ type: Date, default: null })
  publishedAt: Date | null;

  @Prop({ default: false })
  recommend: boolean;
}

export const AnnouncementSchema = SchemaFactory.createForClass(Announcement);

// Optimise the most common queries
AnnouncementSchema.index({ status: 1, publishedAt: -1 });
