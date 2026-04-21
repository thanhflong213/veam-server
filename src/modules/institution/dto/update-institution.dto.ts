import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateInstitutionDto } from './create-institution.dto';

export class UpdateInstitutionDto extends PartialType(
  OmitType(CreateInstitutionDto, ['slug'] as const),
) {}
