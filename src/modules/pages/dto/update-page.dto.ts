import { PartialType, OmitType } from '@nestjs/swagger';
import { CreatePageDto } from './create-page.dto';

export class UpdatePageDto extends PartialType(
  OmitType(CreatePageDto, ['slug'] as const),
) {}
