import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
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
    const allPages = await this.pageModel
      .find({ status: PageStatus.PUBLISHED })
      .select('-contentHtml')
      .sort({ slug: 1 })
      .lean<Record<string, unknown>[]>()
      .exec();

    const childrenByParent = new Map<string, Record<string, unknown>[]>();
    for (const page of allPages) {
      if (page.parent) {
        const key = String(page.parent);
        if (!childrenByParent.has(key)) childrenByParent.set(key, []);
        childrenByParent.get(key)!.push(page);
      }
    }

    const attachChildren = (page: Record<string, unknown>): Record<string, unknown> => ({
      ...page,
      children: (childrenByParent.get(String(page._id)) ?? []).map(attachChildren),
    });

    return allPages.filter((page) => !page.parent).map(attachChildren);
  }

  async findAll(): Promise<PageDocument[]> {
    return this.pageModel.find().select('-contentHtml').sort({ slug: 1 }).exec();
  }

  async findById(id: string): Promise<PageDocument> {
    const page = await this.pageModel.findById(id).exec();
    if (!page) throw new NotFoundException('Page not found');
    return page;
  }

  async findBySlug(slug: string): Promise<PageDocument> {
    const page = await this.pageModel
      .findOne({ slug: slug.toLowerCase(), status: PageStatus.PUBLISHED, disabled: { $ne: true } })
      .exec();
    if (!page) throw new NotFoundException(`Page "${slug}" not found`);
    return page;
  }

  private async wouldCreateCycle(pageId: string, newParentId: string): Promise<boolean> {
    let currentId: string | null = newParentId;
    while (currentId) {
      if (currentId === pageId) return true;
      const ancestor = await this.pageModel
        .findById(currentId)
        .select('parent')
        .lean<{ parent: unknown } | null>()
        .exec();
      currentId = ancestor?.parent ? String(ancestor.parent) : null;
    }
    return false;
  }

  async update(id: string, dto: UpdatePageDto): Promise<PageDocument> {
    if (dto.parent !== undefined && dto.parent !== null) {
      if (String(dto.parent) === id) {
        throw new BadRequestException('A page cannot be its own parent');
      }
      if (await this.wouldCreateCycle(id, String(dto.parent))) {
        throw new BadRequestException('Setting this parent would create a circular reference');
      }
    }
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
