import { ResponseError } from '../generated';

export const handleRequestError = (
  error: unknown,
  msg: string,
  logger: (arg0: any) => void = console.error,
) => {
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
  }
};
