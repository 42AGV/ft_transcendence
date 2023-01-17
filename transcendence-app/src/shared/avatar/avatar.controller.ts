import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiProduces,
  ApiTags,
} from '@nestjs/swagger';
import { TwoFactorAuthenticatedGuard } from '../guards/two-factor-authenticated.guard';
import { AvatarService } from './avatar.service';

@Controller('avatar')
@UseGuards(TwoFactorAuthenticatedGuard)
@ApiTags('avatar')
@ApiForbiddenResponse({ description: 'Forbidden' })
export class AvatarController {
  constructor(private avatarService: AvatarService) {}

  @Get(':avatarId')
  @ApiProduces('image/jpeg')
  @ApiOkResponse({
    schema: {
      type: 'file',
      format: 'binary',
    },
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  async getAvatarByAvatarId(
    @Param('avatarId', ParseUUIDPipe) avatarId: string,
  ): Promise<StreamableFile> {
    const streamableFile = await this.avatarService.getAvatarById(avatarId);

    if (!streamableFile) {
      throw new NotFoundException();
    }
    return streamableFile;
  }
}
