import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type InstitutionDocument = HydratedDocument<Institution>;

export enum InstitutionStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

@Schema({ timestamps: true })
export class Institution {
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
    enum: Object.values(InstitutionStatus),
    default: InstitutionStatus.DRAFT,
  })
  status: InstitutionStatus;

  @Prop({ type: Date, default: null })
  publishedAt: Date | null;
}

export const InstitutionSchema = SchemaFactory.createForClass(Institution);

InstitutionSchema.index({ status: 1, publishedAt: -1 });
