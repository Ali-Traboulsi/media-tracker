import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('recommendations')
  async getRecommendations(
    @Req() req: any,
    @Query('type') mediaType?: string,
  ) {
    return this.aiService.getRecommendations(req.user.userId, mediaType);
  }

  @Get('insights')
  async getInsights(@Req() req: any) {
    return this.aiService.getMediaInsights(req.user.userId);
  }
}
