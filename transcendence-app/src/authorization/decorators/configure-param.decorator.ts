import { SetMetadata } from '@nestjs/common';

export const CONFIG_PARAM_KEY = 'config_param';

export const ConfigParam = (param: string) =>
  SetMetadata(CONFIG_PARAM_KEY, param);
