import { IsInt, IsOptional, Max, Min } from 'class-validator';

export const MAX_USER_ENTRIES_PER_PAGE = 20;

export class UsersPaginationQueryDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(MAX_USER_ENTRIES_PER_PAGE)
  limit!: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(MAX_USER_ENTRIES_PER_PAGE)
  offset!: number;

  @IsOptional()
  sort!: boolean;
}
