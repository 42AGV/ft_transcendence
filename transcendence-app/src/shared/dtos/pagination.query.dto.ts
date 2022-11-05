import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { MAX_ENTRIES_PER_PAGE } from '../constants';

export class PaginationQueryDto {
  @ApiPropertyOptional({
    description: `The number of results (max ${MAX_ENTRIES_PER_PAGE})`,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(MAX_ENTRIES_PER_PAGE)
  limit?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  offset?: number;
}
