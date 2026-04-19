import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Announcement,
  AnnouncementDocument,
  AnnouncementStatus,
} from './schemas/announcement.schema';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { QueryAnnouncementDto } from './dto/query-announcement.dto';
import { generateSlug } from '../../common/helpers/slug.helper';
import {
  buildPagination,
  buildPaginationMeta,
} from '../../common/helpers/pagination.helper';

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectModel(Announcement.name)
    private readonly announcementModel: Model<AnnouncementDocument>,
  ) {}

  async create(dto: CreateAnnouncementDto): Promise<AnnouncementDocument> {
    const slug = generateSlug(dto.slug ?? dto.title);
    const existing = await this.announcementModel.findOne({ slug }).exec();
    if (existing) {
      throw new ConflictException(
        `Announcement with slug "${slug}" already exists`,
      );
    }
    const publishedAt =
      dto.status === AnnouncementStatus.PUBLISHED
        ? dto.publishedAt
          ? new Date(dto.publishedAt)
          : new Date()
        : null;

    return this.announcementModel.create({ ...dto, slug, publishedAt });
  }

  async findPublished(query: QueryAnnouncementDto) {
    const { skip, limit, page } = buildPagination(query);
    const filter = {
      status: AnnouncementStatus.PUBLISHED,
      ...(query.search && {
        title: { $regex: query.search, $options: 'i' },
      }),
    };
    const [items, total] = await Promise.all([
      this.announcementModel
        .find(filter)
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.announcementModel.countDocuments(filter),
    ]);
    return { items, ...buildPaginationMeta(total, page, limit) };
  }

  async findAll(query: QueryAnnouncementDto) {
    const { skip, limit, page } = buildPagination(query);
    const filter = {
      ...(query.search && {
        title: { $regex: query.search, $options: 'i' },
      }),
    };
    const [items, total] = await Promise.all([
      this.announcementModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.announcementModel.countDocuments(filter),
    ]);
    return { items, ...buildPaginationMeta(total, page, limit) };
  }

  async findBySlug(slug: string): Promise<AnnouncementDocument> {
    const doc = await this.announcementModel
      .findOne({ slug: slug.toLowerCase(), status: AnnouncementStatus.PUBLISHED })
      .exec();
    if (!doc) throw new NotFoundException(`Announcement "${slug}" not found`);
    return doc;
  }

  async update(
    id: string,
    dto: UpdateAnnouncementDto,
  ): Promise<AnnouncementDocument> {
    const existing = await this.announcementModel.findById(id).exec();
    if (!existing) throw new NotFoundException('Announcement not found');

    const patch: Record<string, unknown> = { ...dto };

    // Convert publishedAt string → Date if provided
    if (typeof dto.publishedAt === 'string') {
      patch.publishedAt = new Date(dto.publishedAt);
    }

    // Auto-set publishedAt the first time status flips to published
    if (
      dto.status === AnnouncementStatus.PUBLISHED &&
      !existing.publishedAt &&
      !patch.publishedAt
    ) {
      patch.publishedAt = new Date();
    }

    const updated = await this.announcementModel
      .findByIdAndUpdate(id, { $set: patch }, { new: true, runValidators: true })
      .exec();

    return updated!;
  }

  async remove(id: string): Promise<void> {
    const result = await this.announcementModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Announcement not found');
  }
}
