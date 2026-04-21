import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';

export type PageDocument = HydratedDocument<Page>;

export enum PageStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

@Schema({ timestamps: true })
export class Page {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  slug: string;

  @Prop({ required: true })
  title: string;

  @Prop({ default: '' })
  contentHtml: string;

  @Prop({ default: '' })
  seoTitle: string;

  @Prop({ default: '' })
  seoDescription: string;

  @Prop({
    type: String,
    enum: Object.values(PageStatus),
    default: PageStatus.DRAFT,
  })
  status: PageStatus;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Page', default: null })
  parent: mongoose.Types.ObjectId | null;

  @Prop({ default: false })
  disabled!: boolean;
}

export const PageSchema = SchemaFactory.createForClass(Page);
