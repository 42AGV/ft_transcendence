import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';
import { MAX_MESSAGES_PER_CHAT } from '../../shared/constants';

export class ChatMessagePaginationQueryDto {
  @ApiPropertyOptional({
    description: `The number of results (max ${MAX_MESSAGES_PER_CHAT})`,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(MAX_MESSAGES_PER_CHAT)
  limit?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  offset?: number;

  @IsUUID()
  user1Id!: string;

  @IsUUID()
  user2Id!: string;
}
