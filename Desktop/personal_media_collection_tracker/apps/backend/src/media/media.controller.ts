import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  // UseGuards,
  // Req,
  Query,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { CreateMediaItemDto, UpdateMediaItemDto } from './dto/media.dto';
import { MediaType, MediaStatus } from '@prisma/client';
// import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('media')
// @UseGuards(JwtAuthGuard)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  create(@Body() createMediaItemDto: CreateMediaItemDto) {
    // Use a hardcoded userId for now without authentication
    return this.mediaService.create('demo-user-id', createMediaItemDto);
  }

  @Get()
  findAll(
    @Query('type') type?: MediaType,
    @Query('status') status?: MediaStatus,
  ) {
    return this.mediaService.findAll('demo-user-id', type, status);
  }

  @Get('stats')
  getStats() {
    return this.mediaService.getStats('demo-user-id');
  }

  @Get('search')
  searchMedia(@Query('q') query: string) {
    return this.mediaService.searchMedia('demo-user-id', query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mediaService.findOne(id, 'demo-user-id');
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMediaItemDto: UpdateMediaItemDto,
  ) {
    return this.mediaService.update(id, 'demo-user-id', updateMediaItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mediaService.remove(id, 'demo-user-id');
  }
}