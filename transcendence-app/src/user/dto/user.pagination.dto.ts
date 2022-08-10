import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { BooleanString } from '../../shared/enums/boolean-string.enum';

export const MAX_USER_ENTRIES_PER_PAGE = 20;

export class UsersPaginationQueryDto {
  @ApiPropertyOptional({
    description: `The number of results (max ${MAX_USER_ENTRIES_PER_PAGE})`,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(MAX_USER_ENTRIES_PER_PAGE)
  limit?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  offset?: number;

  @IsOptional()
  @IsEnum(BooleanString)
  sort?: BooleanString;

  @IsOptional()
  @IsString()
  search?: string;
}
