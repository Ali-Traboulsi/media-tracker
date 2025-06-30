import { IsString, IsEnum, IsOptional, IsInt, Min, Max } from 'class-validator';
import { MediaType, MediaStatus } from '@prisma/client';

export class CreateMediaItemDto {
  @IsString()
  title: string;

  @IsEnum(MediaType)
  type: MediaType;

  @IsOptional()
  @IsEnum(MediaStatus)
  status?: MediaStatus;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  rating?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  coverUrl?: string;
}

export class UpdateMediaItemDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsEnum(MediaType)
  type?: MediaType;

  @IsOptional()
  @IsEnum(MediaStatus)
  status?: MediaStatus;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  rating?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  coverUrl?: string;
}
