import { Controller, Get, Query, /* UseGuards, Req */ } from '@nestjs/common';
import { AiService } from './ai.service';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ai')
// @UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('recommendations')
  async getRecommendations(
    @Query('type') mediaType?: string,
  ) {
    return this.aiService.getRecommendations('demo-user-id', mediaType);
  }

  @Get('insights')
  async getInsights() {
    return this.aiService.getMediaInsights('demo-user-id');
  }
}
