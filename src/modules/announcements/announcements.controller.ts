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
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { QueryAnnouncementDto } from './dto/query-announcement.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('announcements')
@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  // ── Public ────────────────────────────────────────────────────────────────

  @Get()
  @ApiOperation({
    summary: 'List published announcements — paginated, searchable by title',
  })
  findPublished(@Query() query: QueryAnnouncementDto) {
    return this.announcementsService.findPublished(query);
  }

  // ── Admin — declared before :slug to prevent route collision ──────────────

  @Get('manage')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: list all announcements (draft + published)' })
  findAll(@Query() query: QueryAnnouncementDto) {
    return this.announcementsService.findAll(query);
  }

  @Get('manage/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: get a single announcement by ID (includes contentHtml)' })
  findById(@Param('id') id: string) {
    return this.announcementsService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: create an announcement' })
  create(@Body() dto: CreateAnnouncementDto) {
    return this.announcementsService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: update an announcement by ID' })
  update(@Param('id') id: string, @Body() dto: UpdateAnnouncementDto) {
    return this.announcementsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin: delete an announcement by ID' })
  async remove(@Param('id') id: string) {
    await this.announcementsService.remove(id);
    return { deleted: true };
  }

  // ── Public — after static routes ──────────────────────────────────────────

  @Get(':slug')
  @ApiOperation({ summary: 'Get a single published announcement by slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.announcementsService.findBySlug(slug);
  }
}
