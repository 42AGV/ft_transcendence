import { IsOptional, IsString, IsEnum } from 'class-validator';
import { PaginationQueryDto } from './pagination.query.dto';
import { BooleanString } from '../enums/boolean-string.enum';

export class PaginationWithSearchQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(BooleanString)
  sort?: BooleanString;

  @IsOptional()
  @IsString()
  search?: string;
}
