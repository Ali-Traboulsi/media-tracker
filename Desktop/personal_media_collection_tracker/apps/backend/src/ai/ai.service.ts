import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AiService {
  private huggingFaceApiUrl = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-large';

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  async getRecommendations(userId: string, mediaType?: string) {
    try {
      // Get user's media collection for context
      const userMedia = await this.prisma.mediaItem.findMany({
        where: { 
          userId,
          ...(mediaType && { type: mediaType as any })
        },
        select: {
          title: true,
          type: true,
          status: true,
          rating: true,
        },
        take: 20,
        orderBy: { rating: 'desc' }
      });

      const favoriteMedia = userMedia
        .filter(item => item.rating && item.rating >= 8)
        .map(item => `${item.title} (${item.type})`)
        .slice(0, 5)
        .join(', ');

      // Use a simple rule-based recommendation system as fallback
      const recommendations = await this.generateSimpleRecommendations(mediaType, favoriteMedia);

      return { recommendations };
    } catch (error) {
      console.error('Recommendation Error:', error);
      return { 
        error: 'Failed to generate recommendations',
        recommendations: []
      };
    }
  }

  private async generateSimpleRecommendations(mediaType?: string, favoriteMedia?: string): Promise<string[]> {
    // Simple rule-based recommendations - can be enhanced later
    const movieRecommendations = [
      'The Shawshank Redemption',
      'Inception',
      'The Dark Knight',
      'Pulp Fiction',
      'The Matrix'
    ];

    const tvShowRecommendations = [
      'Breaking Bad',
      'Game of Thrones',
      'Stranger Things',
      'The Office',
      'Friends'
    ];

    const bookRecommendations = [
      'The Great Gatsby',
      'To Kill a Mockingbird',
      '1984',
      'Pride and Prejudice',
      'The Catcher in the Rye'
    ];

    const gameRecommendations = [
      'The Witcher 3',
      'Red Dead Redemption 2',
      'God of War',
      'The Last of Us',
      'Minecraft'
    ];

    const podcastRecommendations = [
      'The Joe Rogan Experience',
      'Serial',
      'This American Life',
      'Radiolab',
      'The Daily'
    ];

    switch (mediaType?.toUpperCase()) {
      case 'MOVIE':
        return movieRecommendations;
      case 'TV_SHOW':
        return tvShowRecommendations;
      case 'BOOK':
        return bookRecommendations;
      case 'GAME':
        return gameRecommendations;
      case 'PODCAST':
        return podcastRecommendations;
      default:
        // Mix of all types
        return [
          ...movieRecommendations.slice(0, 1),
          ...tvShowRecommendations.slice(0, 1),
          ...bookRecommendations.slice(0, 1),
          ...gameRecommendations.slice(0, 1),
          ...podcastRecommendations.slice(0, 1)
        ];
    }
  }

  async getMediaInsights(userId: string) {
    const stats = await this.prisma.mediaItem.aggregate({
      where: { userId },
      _count: { id: true },
      _avg: { rating: true },
    });

    const statusBreakdown = await this.prisma.mediaItem.groupBy({
      by: ['status'],
      where: { userId },
      _count: { status: true },
    });

    const typeBreakdown = await this.prisma.mediaItem.groupBy({
      by: ['type'],
      where: { userId },
      _count: { type: true },
    });

    return {
      totalItems: stats._count.id,
      averageRating: Math.round((stats._avg.rating || 0) * 10) / 10,
      statusBreakdown: statusBreakdown.reduce((acc, curr) => {
        acc[curr.status] = curr._count.status;
        return acc;
      }, {}),
      typeBreakdown: typeBreakdown.reduce((acc, curr) => {
        acc[curr.type] = curr._count.type;
        return acc;
      }, {}),
    };
  }
}
