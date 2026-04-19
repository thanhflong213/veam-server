import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateAnnouncementDto } from './create-announcement.dto';

// Slug is intentionally excluded — it is immutable after creation.
export class UpdateAnnouncementDto extends PartialType(
  OmitType(CreateAnnouncementDto, ['slug'] as const),
) {}
