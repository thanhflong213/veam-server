import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InstitutionService } from './institution.service';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';
import { QueryInstitutionDto } from './dto/query-institution.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('institutions')
@Controller('institutions')
export class InstitutionController {
  constructor(private readonly institutionService: InstitutionService) {}

  // ── Public ────────────────────────────────────────────────────────────────

  @Get()
  @ApiOperation({
    summary: 'List published institutions — paginated, searchable by title',
  })
  findPublished(@Query() query: QueryInstitutionDto) {
    return this.institutionService.findPublished(query);
  }

  // ── Admin — declared before :slug to prevent route collision ──────────────

  @Get('manage')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: list all institutions (draft + published)' })
  findAll(@Query() query: QueryInstitutionDto) {
    return this.institutionService.findAll(query);
  }

  @Get('manage/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: get a single institution by ID (includes contentHtml)' })
  findById(@Param('id') id: string) {
    return this.institutionService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: create an institution' })
  create(@Body() dto: CreateInstitutionDto) {
    return this.institutionService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: update an institution by ID' })
  update(@Param('id') id: string, @Body() dto: UpdateInstitutionDto) {
    return this.institutionService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin: delete an institution by ID' })
  async remove(@Param('id') id: string) {
    await this.institutionService.remove(id);
    return { deleted: true };
  }

  // ── Public — after static routes ──────────────────────────────────────────

  @Get(':slug')
  @ApiOperation({ summary: 'Get a single published institution by slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.institutionService.findBySlug(slug);
  }
}
