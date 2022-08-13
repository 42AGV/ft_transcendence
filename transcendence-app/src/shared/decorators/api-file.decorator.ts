import { ApiBody } from '@nestjs/swagger';

export const ApiFile =
  (fileName = 'file'): MethodDecorator =>
  (target, propertyKey, descriptor) => {
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          [fileName]: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    })(target, propertyKey, descriptor);
  };
