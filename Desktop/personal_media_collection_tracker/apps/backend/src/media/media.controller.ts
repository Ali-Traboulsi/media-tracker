import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { CreateMediaItemDto, UpdateMediaItemDto } from './dto/media.dto';
import { MediaType, MediaStatus } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('media')
@UseGuards(JwtAuthGuard)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  create(@Req() req: any, @Body() createMediaItemDto: CreateMediaItemDto) {
    return this.mediaService.create(req.user.userId, createMediaItemDto);
  }

  @Get()
  findAll(
    @Req() req: any,
    @Query('type') type?: MediaType,
    @Query('status') status?: MediaStatus,
  ) {
    return this.mediaService.findAll(req.user.userId, type, status);
  }

  @Get('stats')
  getStats(@Req() req: any) {
    return this.mediaService.getStats(req.user.userId);
  }

  @Get('search')
  searchMedia(@Req() req: any, @Query('q') query: string) {
    return this.mediaService.searchMedia(req.user.userId, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.mediaService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Req() req: any,
    @Body() updateMediaItemDto: UpdateMediaItemDto,
  ) {
    return this.mediaService.update(id, req.user.userId, updateMediaItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.mediaService.remove(id, req.user.userId);
  }
}