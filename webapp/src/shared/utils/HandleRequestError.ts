import { ResponseError } from '../generated';

export const handleRequestError = (
  error: unknown,
  msg: string,
  loggerParam?: (arg0: any) => void,
) => {
  const logger = loggerParam ? loggerParam : (arg0: any) => console.error(arg0);
  if (error instanceof ResponseError) {
    error.response.json().then((responseBody) => {
      if (responseBody.message) {
        logger(responseBody.message);
      } else {
        logger(error.response.statusText);
      }
    });
  } else if (error instanceof Error) {
    logger(error.message);
  } else {
    logger(msg);
  }
};
