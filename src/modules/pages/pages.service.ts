import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Page, PageDocument, PageStatus } from './schemas/page.schema';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { generateSlug } from '../../common/helpers/slug.helper';

@Injectable()
export class PagesService {
  constructor(
    @InjectModel(Page.name) private readonly pageModel: Model<PageDocument>,
  ) {}

  async create(dto: CreatePageDto): Promise<PageDocument> {
    const slug = generateSlug(dto.slug);
    const existing = await this.pageModel.findOne({ slug }).exec();
    if (existing) {
      throw new ConflictException(`Page with slug "${slug}" already exists`);
    }
    return this.pageModel.create({ ...dto, slug });
  }

  async findPublished(): Promise<Record<string, unknown>[]> {
    const rootPages = await this.pageModel
      .find({ status: PageStatus.PUBLISHED, parent: null })
      .sort({ slug: 1 })
      .lean<Record<string, unknown>[]>()
      .exec();

    const allChildren = await this.pageModel
      .find({ status: PageStatus.PUBLISHED, parent: { $ne: null } })
      .sort({ slug: 1 })
      .lean<Record<string, unknown>[]>()
      .exec();

    const childrenByParent = new Map<string, Record<string, unknown>[]>();
    for (const child of allChildren) {
      const key = String(child.parent);
      if (!childrenByParent.has(key)) childrenByParent.set(key, []);
      childrenByParent.get(key)!.push(child);
    }

    return rootPages.map((page) => ({
      ...page,
      children: childrenByParent.get(String(page._id)) ?? [],
    }));
  }

  async findAll(): Promise<PageDocument[]> {
    return this.pageModel.find().sort({ slug: 1 }).exec();
  }

  async findBySlug(slug: string): Promise<PageDocument> {
    const page = await this.pageModel
      .findOne({ slug: slug.toLowerCase(), status: PageStatus.PUBLISHED, disabled: { $ne: true } })
      .exec();
    if (!page) throw new NotFoundException(`Page "${slug}" not found`);
    return page;
  }

  async update(id: string, dto: UpdatePageDto): Promise<PageDocument> {
    const page = await this.pageModel
      .findByIdAndUpdate(id, dto, { new: true, runValidators: true })
      .exec();
    if (!page) throw new NotFoundException('Page not found');
    return page;
  }

  async remove(id: string): Promise<void> {
    const result = await this.pageModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Page not found');
  }
}
