import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { UserWithAuthorization } from '../infrastructure/db/user-with-authorization.entity';
import { AuthorizationService } from '../authorization.service';

@Injectable()
export class GlobalAuthUserPipe
  implements
    PipeTransform<Partial<string>, Promise<UserWithAuthorization | null>>
{
  constructor(private readonly authorizationService: AuthorizationService) {}

  async transform(
    userId: string,
    metadata: ArgumentMetadata,
  ): Promise<UserWithAuthorization | null> {
    void metadata;
    return this.authorizationService.getUserWithAuthorizationFromId(userId);
  }
}
