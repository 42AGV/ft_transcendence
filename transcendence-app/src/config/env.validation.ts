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

  @IsUrl({ require_tld: false })
  MEMCACHED_HOST!: string;

  @IsPort()
  MEMCACHED_PORT!: string;

  @IsString()
  @IsNotEmpty()
  TRANSCENDENCE_APP_DATA!: string;

  @IsUrl({ require_tld: false })
  POSTGRES_HOST!: string;

  @IsPort()
  POSTGRES_PORT!: string;

  @IsString()
  @IsNotEmpty()
  POSTGRES_DB!: string;

  @IsString()
  @IsNotEmpty()
  POSTGRES_USER!: string;

  @IsString()
  @IsNotEmpty()
  POSTGRES_PASSWORD!: string;

  @IsUUID()
  SESSION_SECRET!: string;

  @IsUUID()
  MEMCACHED_SECRET!: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config);
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
    forbidUnknownValues: true,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
