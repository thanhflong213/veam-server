import { PartialType, OmitType } from '@nestjs/swagger';
import { CreatePageDto } from './create-page.dto';

// Slug is intentionally excluded — it is immutable after creation.
export class UpdatePageDto extends PartialType(
  OmitType(CreatePageDto, ['slug'] as const),
) {}
