import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Institution,
  InstitutionDocument,
  InstitutionStatus,
} from './schemas/institution.schema';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';
import { QueryInstitutionDto } from './dto/query-institution.dto';
import { generateSlug } from '../../common/helpers/slug.helper';
import {
  buildPagination,
  buildPaginationMeta,
} from '../../common/helpers/pagination.helper';

@Injectable()
export class InstitutionService {
  constructor(
    @InjectModel(Institution.name)
    private readonly institutionModel: Model<InstitutionDocument>,
  ) {}

  async create(dto: CreateInstitutionDto): Promise<InstitutionDocument> {
    const slug = generateSlug(dto.slug ?? dto.title);
    const existing = await this.institutionModel.findOne({ slug }).exec();
    if (existing) {
      throw new ConflictException(
        `Institution with slug "${slug}" already exists`,
      );
    }
    const publishedAt =
      dto.status === InstitutionStatus.PUBLISHED
        ? dto.publishedAt
          ? new Date(dto.publishedAt)
          : new Date()
        : null;

    return this.institutionModel.create({ ...dto, slug, publishedAt });
  }

  async findPublished(query: QueryInstitutionDto) {
    const { skip, limit, page } = buildPagination(query);
    const filter = {
      status: InstitutionStatus.PUBLISHED,
      ...(query.search && {
        title: { $regex: query.search, $options: 'i' },
      }),
    };
    const [items, total] = await Promise.all([
      this.institutionModel
        .find(filter)
        .select('-contentHtml')
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.institutionModel.countDocuments(filter),
    ]);
    return { items, ...buildPaginationMeta(total, page, limit) };
  }

  async findAll(query: QueryInstitutionDto) {
    const { skip, limit, page } = buildPagination(query);
    const filter = {
      ...(query.search && {
        title: { $regex: query.search, $options: 'i' },
      }),
    };
    const [items, total] = await Promise.all([
      this.institutionModel
        .find(filter)
        .select('-contentHtml')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.institutionModel.countDocuments(filter),
    ]);
    return { items, ...buildPaginationMeta(total, page, limit) };
  }

  async findById(id: string): Promise<InstitutionDocument> {
    const doc = await this.institutionModel.findById(id).exec();
    if (!doc) throw new NotFoundException('Institution not found');
    return doc;
  }

  async findBySlug(slug: string): Promise<InstitutionDocument> {
    const doc = await this.institutionModel
      .findOne({ slug: slug.toLowerCase(), status: InstitutionStatus.PUBLISHED })
      .exec();
    if (!doc) throw new NotFoundException(`Institution "${slug}" not found`);
    return doc;
  }

  async update(
    id: string,
    dto: UpdateInstitutionDto,
  ): Promise<InstitutionDocument> {
    const existing = await this.institutionModel.findById(id).exec();
    if (!existing) throw new NotFoundException('Institution not found');

    const patch: Record<string, unknown> = { ...dto };

    if (typeof dto.publishedAt === 'string') {
      patch.publishedAt = new Date(dto.publishedAt);
    }

    if (
      dto.status === InstitutionStatus.PUBLISHED &&
      !existing.publishedAt &&
      !patch.publishedAt
    ) {
      patch.publishedAt = new Date();
    }

    const updated = await this.institutionModel
      .findByIdAndUpdate(id, { $set: patch }, { new: true, runValidators: true })
      .exec();

    return updated!;
  }

  async remove(id: string): Promise<void> {
    const result = await this.institutionModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Institution not found');
  }
}
