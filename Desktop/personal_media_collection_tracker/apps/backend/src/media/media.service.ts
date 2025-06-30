import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMediaItemDto, UpdateMediaItemDto } from './dto/media.dto';
import { MediaType, MediaStatus } from '@prisma/client';

@Injectable()
export class MediaService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createMediaItemDto: CreateMediaItemDto) {
    return this.prisma.mediaItem.create({
      data: {
        ...createMediaItemDto,
        userId,
      },
    });
  }

  async findAll(userId: string, type?: MediaType, status?: MediaStatus) {
    const where: any = { userId };
    
    if (type) where.type = type;
    if (status) where.status = status;

    return this.prisma.mediaItem.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const mediaItem = await this.prisma.mediaItem.findUnique({
      where: { id },
    });

    if (!mediaItem) {
      throw new NotFoundException('Media item not found');
    }

    if (mediaItem.userId !== userId) {
      throw new ForbiddenException('You can only access your own media items');
    }

    return mediaItem;
  }

  async update(id: string, userId: string, updateMediaItemDto: UpdateMediaItemDto) {
    const mediaItem = await this.findOne(id, userId);

    return this.prisma.mediaItem.update({
      where: { id },
      data: updateMediaItemDto,
    });
  }

  async remove(id: string, userId: string) {
    const mediaItem = await this.findOne(id, userId);

    return this.prisma.mediaItem.delete({
      where: { id },
    });
  }

  async getStats(userId: string) {
    const stats = await this.prisma.mediaItem.groupBy({
      by: ['status', 'type'],
      where: { userId },
      _count: {
        id: true,
      },
    });

    const totalItems = await this.prisma.mediaItem.count({
      where: { userId },
    });

    const averageRating = await this.prisma.mediaItem.aggregate({
      where: { userId, rating: { not: null } },
      _avg: { rating: true },
    });

    return {
      totalItems,
      averageRating: averageRating._avg.rating,
      breakdown: stats,
    };
  }

  async searchMedia(userId: string, query: string) {
    return this.prisma.mediaItem.findMany({
      where: {
        userId,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { notes: { contains: query, mode: 'insensitive' } },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
