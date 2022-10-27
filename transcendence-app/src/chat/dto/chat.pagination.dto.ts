import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { BooleanString } from '../../shared/enums/boolean-string.enum';
import { MAX_ENTRIES_PER_PAGE } from '../../shared/constants';

export class ChatsPaginationQueryDto {
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

  @IsOptional()
  @IsEnum(BooleanString)
  sort?: BooleanString;

  @IsOptional()
  @IsString()
  search?: string;
}
