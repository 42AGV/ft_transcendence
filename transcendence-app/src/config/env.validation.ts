import { plainToClass } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsPort,
  IsString,
  IsUrl,
  IsUUID,
  validateSync,
} from 'class-validator';
import { Environment } from '../shared/enums/environment.enum';

export class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV!: Environment;

  @IsString()
  @IsNotEmpty()
  FORTYTWO_APP_ID!: string;

  @IsString()
  @IsNotEmpty()
  FORTYTWO_APP_SECRET!: string;

  @IsUrl({ require_tld: false })
  FORTYTWO_APP_CALLBACK_URL!: string;

  @IsUrl()
  FORTYTWO_APP_AUTHORIZATION_URL!: string;

  @IsUrl()
  FORTYTWO_APP_TOKEN_URL!: string;

  @IsUrl()
  FORTYTWO_APP_PROFILE_URL!: string;

  @IsString()
  @IsNotEmpty()
  MEMCACHED_HOST!: string;

  @IsPort()
  MEMCACHED_PORT!: string;

  @IsUUID()
  SESSION_SECRET!: string;

  @IsUUID()
  MEMCACHED_SECRET!: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
