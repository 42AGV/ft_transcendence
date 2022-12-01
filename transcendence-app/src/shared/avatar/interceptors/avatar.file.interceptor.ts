import { UnprocessableEntityException } from '@nestjs/common';
import {
  AVATARS_PATH,
  AVATAR_MAX_SIZE,
  AVATAR_MIMETYPE_WHITELIST,
} from '../constants';
import LocalFileInterceptor from '../local-file/local-file.interceptor';

export const AvatarFileInterceptor = LocalFileInterceptor({
  fieldName: 'file',
  path: AVATARS_PATH,
  fileFilter: (request, file, callback) => {
    if (!AVATAR_MIMETYPE_WHITELIST.includes(file.mimetype)) {
      const allowedTypes = AVATAR_MIMETYPE_WHITELIST.join(', ');
      return callback(
        new UnprocessableEntityException(
          `Validation failed (allowed types are ${allowedTypes})`,
        ),
        false,
      );
    }
    callback(null, true);
  },
  limits: {
    fileSize: AVATAR_MAX_SIZE,
  },
});
